import { UserInterface } from "../../../types/userInterfaces";
import User from "../models/userModel";
import otpModel from "../models/otpModel";
import { userEntityType, GoogleUserEntityType } from "../../../entities/user";
import wallet from "../models/wallet";
import transactionModel from "../models/transaction";
import { TransactionEntityType } from "../../../entities/transactionEntity";
import transaction from "../models/transaction";
import mongoose from "mongoose";

export const userRepositoryMongoDB = () => {
  const getUserEmail = async (email: string) => {
    const user: UserInterface | null = await User.findOne({ email });
    return user;
  };

  const getUserbyId = async (id: string): Promise<UserInterface | null> => {
    console.log('Fetching user with ID:', id);
    const user = await User.findById(id).populate("wallet").lean()
   console.log(user,".....................................user..............................")
    if (!user) {
      return null
    }
    const { _id, ...rest } = user
    return { id: _id.toString(), ...rest } as UserInterface
  }


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
    await User.findOneAndUpdate({ _id: userId }, { isVerified: true ,wallet});
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

  const getWalletUser = async (userId:string) => {
    
    return await wallet.findOne({ userId: userId });

 }


 const updateWallet = async (userId: string, newBalance: number) =>
  await wallet.findOneAndUpdate({ userId }, { $inc: { balance: newBalance } },{ new: true })


 const addWallet = async (userId: string) => await wallet.create({ userId });

 const getAllTransaction = async (userId:any) =>{
  const transactions = await transactionModel.find({userId:userId});
  return transactions;
}  

const allTransactions = async (walletId: mongoose.Types.ObjectId) =>
  await transaction
    .find({ walletId })
    .sort({ createdAt: -1 })
    .populate("walletId")



const createTransaction = async (transactionDetails: TransactionEntityType) =>
  await transaction.create({
    walletId: transactionDetails.getWalletId(),
    type: transactionDetails.getType(),
    description: transactionDetails.getDescription(),
    amount: transactionDetails.getAmount(),
  })
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
    createTransaction,
    getAllUsers,
    updateUserBlock,
    getUserByNumber,
    getWalletUser,
    getAllTransaction,
    addWallet,
    allTransactions,
    updateWallet
  };
};
export type userRepositoryMongoDB = typeof userRepositoryMongoDB;
