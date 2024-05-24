import {
  ownerDbInterface,
  ownerDbInterfaceType,
} from "../../interfaces/ownerDbInterface";
import { userDbInterface } from "../../interfaces/userDbRepositories";

export const blockUser = async (
  id: string,
  userDbRepository: ReturnType<userDbInterface>
) => {
  const user = await userDbRepository.getUserById(id);
  await userDbRepository.updateUserBlock(id, !user?.isBlocked);
};

export const blockOwner = async (
  id: string,
  ownerDbInterface: ReturnType<ownerDbInterfaceType>
) => {
  const user = await ownerDbInterface.getOwnerById(id);
  await ownerDbInterface.updateOwnerBlock(id, !user?.isBlocked);
};
