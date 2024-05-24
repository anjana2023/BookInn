import { GoogleUserEntityType, userEntityType } from "./../../entities/user";

import { userRepositoryMongoDB } from "./../../frameworks/database/repositories/userRepositoryMongoDB";

export const userDbRepository = (
  repository: ReturnType<userRepositoryMongoDB>
) => {
  const getUserByEmail = async (email: string) =>
    await repository.getUserEmail(email);

  const getUserById = async (id: string) => await repository.getUserbyId(id);

  const addUser = async (user: userEntityType) =>
    await repository.addUser(user);

  const addOtp = async (otp: string, id: string) =>
    await repository.addOtp(otp, id);

  const findOtpWithUser = async (userId: string) =>
    await repository.findUserOtp(userId);

  const deleteOtpWithUser = async (userId: string) =>
    await repository.deleteUserOtp(userId);

  const updateUserverification = async (userId: string) =>
    await repository.updateUserVerified(userId);

  const registerGoogleoUser = async (user: GoogleUserEntityType) =>
    await repository.registerGoogleSignedUser(user);

  const verifyAndResetPassword = async (
    verificationCode: string,
    password: string
  ) =>
    await repository.findVerificationCodeAndUpdate(verificationCode, password);

  const updateVerificationCode = async (
    email: string,
    verificationCode: string
  ) => await repository.updateVerificationCode(email, verificationCode);

  const getUserByNumber = async (phoneNumber: string) =>
    await repository.getUserByNumber(phoneNumber);

  const updateProfile = async (userId: string, userData: Record<string, any>) =>
    await repository.updateUserInfo(userId, userData);

  const getAllUsers = async () => await repository.getAllUsers();

  const updateUserBlock = async (id: string, status: boolean) =>
    await repository.updateUserBlock(id, status);

  return {
    getUserByEmail,
    addUser,
    addOtp,
    findOtpWithUser,
    deleteOtpWithUser,
    updateUserverification,
    registerGoogleoUser,
    verifyAndResetPassword,
    updateVerificationCode,
    getUserById,
    updateProfile,
    getAllUsers,
    updateUserBlock,
    getUserByNumber,
  };
};
export type userDbInterface = typeof userDbRepository;
