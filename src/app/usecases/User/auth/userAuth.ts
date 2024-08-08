import createUserEntity, {
  userEntityType,
  GoogleSignInUserEntity,
  GoogleUserEntityType,
} from "../../../../entities/user";
import { GoogleResponseType } from "../../../../types/GoogleResponseTypes";
import { HttpStatus } from "../../../../types/httpStatus";

import AppError from "../../../../utils/appError";
import {
  CreateUserInterface,
  UserInterface,
} from "../../../../types/userInterfaces";

import { AuthServiceInterface } from "../../../service-interface/authServices";
import { userDbInterface } from "../../../interfaces/userDbRepositories";
import sendMail from "../../../../utils/sendMail";
import { forgotPasswordEmail, otpEmail } from "../../../../utils/userEmail";

export const userRegister = async (
  user: CreateUserInterface,
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, password, phoneNumber, role } = user;
  const authenticationMethod = "password";
  const existingEmailUser = await userRepository.getUserByEmail(email);
  if (existingEmailUser) {
    throw new AppError(
      "this email is already register with an account",
      HttpStatus.UNAUTHORIZED
    );
  }
  const hashedPassword: string = await authService.encryptPassword(password);

  const userEntity: userEntityType = createUserEntity(
    name,
    email,
    phoneNumber,
    hashedPassword,
    role,
    authenticationMethod
  );

  const newUser: UserInterface = await userRepository.addUser(userEntity);

  const OTP = authService.generateOtp();

  await userRepository.addOtp(OTP, newUser.id);
  const emailSubject = "Account verification";
  sendMail(newUser.email, emailSubject, otpEmail(OTP, newUser.name));

return  newUser

};

export const loginUser = async (
  user: { email: string; password: string },
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { email, password } = user;
  const isEmailExist = await userRepository.getUserByEmail(email);

  if (isEmailExist?.authenticationMethod === "google") {
    throw new AppError("Only login with google", HttpStatus.BAD_REQUEST);
  }

  if (!isEmailExist) {
    throw new AppError("Email Does Not Exist", HttpStatus.UNAUTHORIZED);
  }

  if (isEmailExist.isBlocked) {
    throw new AppError("Account is Blocked", HttpStatus.FORBIDDEN);
  }
  if (!isEmailExist.isVerified) {
    throw new AppError("Account is not verified", HttpStatus.UNAUTHORIZED);
  }
  if (!isEmailExist.password) {
    throw new AppError("Invalid Credential", HttpStatus.UNAUTHORIZED);
  }

  const ispasswordMatched = await authService.comparePassword(
    password,
    isEmailExist?.password
  );
  if (!ispasswordMatched) {
    throw new AppError("Password is Wrong", HttpStatus.UNAUTHORIZED);
  }

  const {accessToken,refreshToken} = authService.createTokens(
    isEmailExist.id,
    isEmailExist.name,
    isEmailExist.role
);

return {accessToken,isEmailExist,refreshToken};
};


export const verifyOtpUser = async (
  otp: string,
  userId: string,
  userRepository: ReturnType<userDbInterface>
) => {
  
  if (!otp) {
    throw new AppError("please provide an OTP", HttpStatus.BAD_REQUEST);
  }
  const otpUser = await userRepository.findOtpWithUser(userId);
  if (!otpUser) {
    throw new AppError("Invlaid OTP ", HttpStatus.BAD_REQUEST);
  }
  if (otpUser.otp === otp) {
    const wallet = await userRepository.addWallet(userId)
    await userRepository.updateProfile(userId, {
      isVerified: true,
      wallet: wallet._id,
    });
    // await userRepository.updateUserverification(userId);
    return true;
  } else {
    throw new AppError("Invalid OTP,try again", HttpStatus.BAD_REQUEST);
  }
};



export const authenticateGoogleUser = async (
  userData: GoogleResponseType,
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, picture, email_verified, role } = userData;
  const authenticationMethod = "google";

  const isEmailExist = await userRepository.getUserByEmail(email);
  
  if(isEmailExist?.authenticationMethod === "password"){
    
    throw new AppError("you can use login form",HttpStatus.BAD_REQUEST);
  }
  if (isEmailExist?.isBlocked) {
    throw new AppError(
      "Your account is blocked by administrator",
      HttpStatus.FORBIDDEN
    );
  }
 
  if (isEmailExist) {
    const {accessToken,refreshToken} = authService.createTokens(
      isEmailExist.id,
      isEmailExist.name,
      isEmailExist.role
    );
    return {
      isEmailExist,
      accessToken,
      refreshToken
    };
  } else {
    const googleUser: GoogleUserEntityType = GoogleSignInUserEntity(
      name,
      email,
      picture,
      email_verified,
      role,
      authenticationMethod
    );
    const newUser = await userRepository.registerGoogleoUser(googleUser);
    const wallet = await userRepository.addWallet(newUser.id);
    const userId = newUser._id as unknown as string;
    const Name = newUser.name as unknown as string;

    const accessToken = authService.createTokens(userId, Name, role);
    return { accessToken, newUser };
  }
};
export const sendResetVerificationCode = async (
  email: string,
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const isEmailExist = await userRepository.getUserByEmail(email);

  if (isEmailExist?.authenticationMethod === "google") {
    throw new AppError(
      `${email} is sign in using google signin method .Do not reset the password `,
      HttpStatus.BAD_REQUEST
    );
  }

  if (!isEmailExist)
    throw new AppError(`${email} does not exist`, HttpStatus.BAD_REQUEST);

  const verificationCode = authService.getRandomString();

  const isUpdated = await userRepository.updateVerificationCode(
    email,
    verificationCode
  );


  sendMail(
    email,
    "Reset password",
    forgotPasswordEmail(isEmailExist.name, verificationCode)
  );
};

export const verifyTokenResetPassword = async (
  verificationCode: string,
  password: string,
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (!verificationCode)
    throw new AppError(
      "Please provide a verification code",
      HttpStatus.BAD_REQUEST
    );
  const hashedPassword = await authService.encryptPassword(password);
  const isPasswordUpdated = await userRepository.verifyAndResetPassword(
    verificationCode,
    hashedPassword
  );
  if (!isPasswordUpdated) {
    throw new AppError(
      "Invalid token or token expired",
      HttpStatus.BAD_REQUEST
    );
  }
};

export const deleteOtp = async (
  userId: string,
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  
  const newOtp: string = authService.generateOtp();
 

  const deleted = await userRepository.deleteOtpWithUser(userId);


  if (deleted) {
    await userRepository.addOtp(newOtp, userId);
  }
  const user = await userRepository.getUserById(userId);


  if (!user) {
    throw new AppError("User not found", HttpStatus.NOT_FOUND);
  }

  const emailSubject = "Account verification ,New Otp";
  sendMail(user.email, emailSubject, otpEmail(newOtp, user.name));

};


export const getUserById = async (
  id: string,
  userRepository: ReturnType<userDbInterface>
) => await userRepository.getUserById(id);

