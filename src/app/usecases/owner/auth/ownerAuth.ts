import createOwnerEntity, {
  ownerEntityType,
  GoogleSignInOwnerEntity,
  GoogleOwnerEntityType,
} from "../../../../entities/owner";
import { GoogleResponseType } from "../../../../types/GoogleResponseTypes";
import { HttpStatus } from "../../../../types/httpStatus";

import AppError from "../../../../utils/appError";
import {
  CreateOwnerInterface,
  OwnerInterface,
} from "../../../../types/ownerInterfaces";
import { AuthServiceInterface } from "../../../service-interface/authServices";
import {
  ownerDbInterface,
  ownerDbInterfaceType,
} from "../../../interfaces/ownerDbInterface";
import sendMail from "../../../../utils/sendMail";
import { forgotPasswordEmail, otpEmail } from "../../../../utils/userEmail";

export const OwnerRegister = async (
  owner: CreateOwnerInterface,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, password, phoneNumber, role } = owner;
  console.log(owner);

  const existingEmailOwner = await ownerRepository.getOwnerByEmail(email);
  if (existingEmailOwner) {
    throw new AppError(
      "this email is already register with an account",
      HttpStatus.UNAUTHORIZED
    );
  }
  const hashedPassword: string = await authService.encryptPassword(password);

  const ownerEntity: ownerEntityType = createOwnerEntity(
    name,
    email,
    phoneNumber,
    hashedPassword,
    role
  );

  const newOwner: OwnerInterface = await ownerRepository.addOwner(ownerEntity);

  const OTP = authService.generateOtp();

  console.log(OTP);

  await ownerRepository.addOtp(OTP, newOwner.id);
  const emailSubject = "Account verification";
  sendMail(newOwner.email, emailSubject, otpEmail(OTP, newOwner.name));

  return newOwner;
};

export const loginOwner = async (
  owner: { email: string; password: string },
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { email, password } = owner;
  const isEmailExist = await ownerRepository.getOwnerByEmail(email);

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

  const accessToken = authService.createTokens(
    isEmailExist.id,
    isEmailExist.name,
    isEmailExist.role
  );
  return { accessToken, isEmailExist };
};

export const verifyOtpOwner = async (
  otp: string,
  ownerId: string,
  ownerRepository: ReturnType<ownerDbInterfaceType>
) => {
  if (!otp) {
    throw new AppError("please provide an OTP", HttpStatus.BAD_REQUEST);
  }
  const otpOwner = await ownerRepository.findOtpWithOwner(ownerId);
  console.log(otpOwner);

  if (!otpOwner) {
    throw new AppError("Invlaid OTP ", HttpStatus.BAD_REQUEST);
  }
  if (otpOwner.otp === otp) {
    await ownerRepository.updateOwnerverification(ownerId);
    return true;
  } else {
    throw new AppError("Invalid OTP,try again", HttpStatus.BAD_REQUEST);
  }
};

export const authenticateGoogleOwner = async (
  ownerData: GoogleResponseType,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, picture, email_verified, role } = ownerData;
  const isEmailExist = await ownerRepository.getOwnerByEmail(email);
  if (isEmailExist?.isBlocked) {
    throw new AppError(
      "Your account is blocked by administrator",
      HttpStatus.FORBIDDEN
    );
  }
  if (isEmailExist) {
    const accessToken = authService.createTokens(
      isEmailExist.id,
      isEmailExist.name,
      isEmailExist.role
    );
    return {
      isEmailExist,
      accessToken,
    };
  } else {
    const googleOwner: GoogleOwnerEntityType = GoogleSignInOwnerEntity(
      name,
      email,
      picture,
      email_verified,
      role
    );
    const newOwner = await ownerRepository.registerGoogleOwner(googleOwner);
    const ownerId = newOwner._id as unknown as string;
    const Name = newOwner.name as unknown as string;
    const accessToken = authService.createTokens(ownerId, Name, role);
    return { accessToken, newOwner };
  }
};
export const sendResetVerificationCode = async (
  email: string,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const isEmailExist = await ownerRepository.getOwnerByEmail(email);

  if (!isEmailExist)
    throw new AppError(`${email} does not exist`, HttpStatus.BAD_REQUEST);

  const verificationCode = authService.getRandomString();

  const isUpdated = await ownerRepository.updateVerificationCode(
    email,
    verificationCode
  );
  console.log(
    verificationCode,
    "------------------------------vhdsdsdudkygsud----------------------------------verification code"
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
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (!verificationCode)
    throw new AppError(
      "Please provide a verification code",
      HttpStatus.BAD_REQUEST
    );
  const hashedPassword = await authService.encryptPassword(password);
  const isPasswordUpdated = await ownerRepository.verifyAndResetPassword(
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
  ownerId: string,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const newOtp: string = authService.generateOtp();

  const deleted = await ownerRepository.deleteOtpWithOwner(ownerId);

  console.log(deleted);

  if (deleted) {
    await ownerRepository.addOtp(newOtp, ownerId);
  }
  const owner = await ownerRepository.getOwnerById(ownerId);
  console.log(owner);

  if (!owner) {
    throw new AppError("Owner not found", HttpStatus.NOT_FOUND);
  }

  const emailSubject = "Account verification ,New Otp";
  sendMail(owner.email, emailSubject, otpEmail(newOtp, owner.name));

  console.log(newOtp, "----otp");
};
