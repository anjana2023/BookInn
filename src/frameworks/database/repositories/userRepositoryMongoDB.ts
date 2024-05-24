import { UserInterface } from "../../../types/userInterfaces";
import User from "../models/userModel";
import otpModel from "../models/otpModel";
import { userEntityType, GoogleUserEntityType } from "../../../entities/user";

export const userRepositoryMongoDB = () => {
  const getUserEmail = async (email: string) => {
    const user: UserInterface | null = await User.findOne({ email });
    return user;
  };

  const getUserbyId = async (id: string) => {
    const user: UserInterface | null = await User.findById(id);
    return user;
  };

  const addUser = async (user: userEntityType) => {
    const newUser: any = new User({
      name: user.getName(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber(),
      password: user.getPassword(),
      authenticationMethod: user.getAuthenticationMethod(),
    });
    newUser.save();
    return newUser;
  };

  const addOtp = async (otp: string, userId: string) => {
    await otpModel.create({ otp, userId });
  };

  const findUserOtp = async (userId: string) =>
    await otpModel.findOne({ userId });

  const deleteUserOtp = async (userId: string) =>
    await otpModel.deleteOne({ userId });

  const updateUserVerified = async (userId: string) => {
    await User.findOneAndUpdate({ _id: userId }, { isVerified: true });
  };

  const registerGoogleSignedUser = async (user: GoogleUserEntityType) =>
    await User.create({
      name: user.name(),
      email: user.email(),
      profilePic: user.picture(),
      isVerified: user.email_verified(),
      authenticationMethod: user.authenticationMethod(),
    });
  const findVerificationCodeAndUpdate = async (
    code: string,
    newPassword: string
  ) =>
    await User.findOneAndUpdate(
      { verificationCode: code },
      { password: newPassword, verificationCode: null },
      { upsert: true }
    );

  const updateVerificationCode = async (email: string, code: string) =>
    await User.findOneAndUpdate({ email }, { verificationCode: code });

  const updateUserInfo = async (id: string, updateData: Record<string, any>) =>
    await User.findByIdAndUpdate(id, updateData, { new: true });

  const getAllUsers = async () => await User.find({ isVerified: true });

  const updateUserBlock = async (id: string, status: boolean) =>
    await User.findByIdAndUpdate(id, { isBlocked: status });

  const getUserByNumber = async (phoneNumber: string) => {
    const user: UserInterface | null = await User.findOne({ phoneNumber });
    return user;
  };

  return {
    getUserEmail,
    addUser,
    addOtp,
    findUserOtp,
    deleteUserOtp,
    updateUserVerified,
    registerGoogleSignedUser,
    findVerificationCodeAndUpdate,
    updateVerificationCode,
    getUserbyId,
    updateUserInfo,
    getAllUsers,
    updateUserBlock,
    getUserByNumber,
  };
};
export type userRepositoryMongoDB = typeof userRepositoryMongoDB;
