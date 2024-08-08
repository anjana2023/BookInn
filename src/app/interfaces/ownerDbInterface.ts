import { GoogleOwnerEntityType, ownerEntityType } from "../../entities/owner";
import { ownerDbRepositoryType } from "../../frameworks/database/repositories/ownerRepository";

export const ownerDbInterface = (
  repository: ReturnType<ownerDbRepositoryType>
) => {
  const getOwnerByEmail = async (email: string) =>
    await repository.getOwnerEmail(email);

  const getOwnerById = async (id: string) => await repository.getOwnerbyId(id);

  const addOwner = async (owner: ownerEntityType) =>
    await repository.addOwner(owner);

  const addOtp = async (otp: string, id: string) =>
    await repository.addOtp(otp, id);

  const findOtpWithOwner = async (ownerId: string) => {

    return await repository.findOwnerOtp(ownerId);
  };

  const deleteOtpWithOwner = async (ownerId: string) =>
    await repository.deleteOwnerOtp(ownerId);

  const updateOwnerverification = async (ownerId: string) =>
    await repository.updateOwnerVerified(ownerId);

  const registerGoogleOwner = async (owner: GoogleOwnerEntityType) =>
    await repository.registerGoogleSignedOwner(owner);

  const verifyAndResetPassword = async (
    verificationCode: string,
    password: string
  ) =>
    await repository.findVerificationCodeAndUpdate(verificationCode, password);

  const updateVerificationCode = async (
    email: string,
    verificationCode: string
  ) => await repository.updateVerificationCode(email, verificationCode);

  const getOwnerByNumber = async (phoneNumber: string) =>
    await repository.getOwnerByNumber(phoneNumber);

  const updateProfile = async (
    ownerId: string,
    OwnerData: Record<string, any>
  ) => await repository.updateOwnerInfo(ownerId, OwnerData);

  const getAllOwners = async () => await repository.getAllOwners();

  const updateOwnerBlock = async (id: string, status: boolean) =>
    await repository.updateOwnerBlock(id, status);

  return {
    getOwnerByEmail,
    addOwner,
    addOtp,
    findOtpWithOwner,
    deleteOtpWithOwner,
    updateOwnerverification,
    registerGoogleOwner,
    verifyAndResetPassword,
    updateVerificationCode,
    getOwnerById,
    updateProfile,
    getAllOwners,
    updateOwnerBlock,
    getOwnerByNumber,
  };
};

export type ownerDbInterfaceType = typeof ownerDbInterface;
