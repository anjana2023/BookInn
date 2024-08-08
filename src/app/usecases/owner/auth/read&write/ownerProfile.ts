import { ownerDbInterface, ownerDbInterfaceType } from "../../../../interfaces/ownerDbInterface";
import { OwnerInterface } from "../../../../../types/ownerInterfaces";

export const getOwnerProfile = async (
  userID: string,
  ownerRepository: ReturnType<ownerDbInterfaceType>
) => {
  const user = await ownerRepository.getOwnerById(userID);
  return user;
};

export const updateOwner = async (
  userID: string,
  updateData: OwnerInterface,
  ownerRepository: ReturnType<ownerDbInterfaceType>
) => await ownerRepository.updateProfile(userID, updateData);

export const verifyNumber=async(
  phoneNumber:string,
  ownerRepository:ReturnType<ownerDbInterfaceType>
)=>{
  const user=await ownerRepository.getOwnerByNumber(phoneNumber)

  
}