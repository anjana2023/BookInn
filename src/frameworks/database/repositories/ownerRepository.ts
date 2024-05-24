import { OwnerInterface } from "../../../types/ownerInterfaces";
import Owner from "../models/ownerModel";
import otpModel from "../models/otpModel";
import {
  ownerEntityType,
  GoogleOwnerEntityType,
} from "../../../entities/owner";

export const ownerDbRepository = () => {
  const getOwnerEmail = async (email: string) => {
    const owner: OwnerInterface | null = await Owner.findOne({ email });
    return owner;
  };

  const getOwnerbyId = async (id: string) => {
    const owner: OwnerInterface | null = await Owner.findById(id);
    return owner;
  };
  const addOwner = async (owner: ownerEntityType) => {
    const newOwner: any = new Owner({
      name: owner.getName(),
      email: owner.getEmail(),
      phoneNumber: owner.getPhoneNumber(),
      password: owner.getPassword(),
      role: owner.getOwnerRole(),
    });

    newOwner.save();
    return newOwner;
  };
  const addOtp = async (otp: string, ownerId: string) => {
    await otpModel.create({ otp, ownerId });
  };

  const findOwnerOtp = async (ownerId: string) => {
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);

    return await otpModel.findOne({ ownerId });
  };

  const deleteOwnerOtp = async (ownerId: string) =>
    await otpModel.deleteOne({ ownerId });

  const updateOwnerVerified = async (ownerId: string) => {
    await Owner.findOneAndUpdate({ _id: ownerId }, { isVerified: true });
  };

  const registerGoogleSignedOwner = async (owner: GoogleOwnerEntityType) =>
    await Owner.create({
      name: owner.name(),
      email: owner.email(),
      profilePic: owner.picture(),
      isVerified: owner.email_verified(),
      role: owner.getOwnerRole(),
    });

  const findVerificationCodeAndUpdate = async (
    code: string,
    newPassword: string
  ) =>
    await Owner.findOneAndUpdate(
      { verificationCode: code },
      { password: newPassword, verificationCode: null },
      { upsert: true }
    );

  const updateVerificationCode = async (email: string, code: string) =>
    await Owner.findOneAndUpdate({ email }, { verificationCode: code });

  const updateOwnerInfo = async (id: string, updateData: Record<string, any>) =>
    await Owner.findByIdAndUpdate(id, updateData, { new: true });

  const getAllOwners = async () => await Owner.find({ isVerified: true });

  const updateOwnerBlock = async (id: string, status: boolean) =>
    await Owner.findByIdAndUpdate(id, { isBlocked: status });

  const getOwnerByNumber = async (phoneNumber: string) => {
    const user: OwnerInterface | null = await Owner.findOne({ phoneNumber });
    return user;
  };

  return {
    getOwnerEmail,
    addOwner,
    addOtp,
    findOwnerOtp,
    deleteOwnerOtp,
    updateOwnerVerified,
    registerGoogleSignedOwner,
    findVerificationCodeAndUpdate,
    getOwnerbyId,
    updateVerificationCode,
    updateOwnerInfo,
    getOwnerByNumber,
    getAllOwners,
    updateOwnerBlock,
  };
};
export type ownerDbRepositoryType = typeof ownerDbRepository;
