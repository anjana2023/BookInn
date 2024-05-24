import { Request } from "express";
import {
  userDbInterface,
  userDbRepository,
} from "../../interfaces/userDbRepositories";

import {
  ownerDbInterface,
  ownerDbInterfaceType,
} from "../../interfaces/ownerDbInterface";
import sendMail from "../../../utils/sendMail";
import { ownerDbRepository } from "../../../frameworks/database/repositories/ownerRepository";

export const getUsers = async (userDbRepository: ReturnType<userDbInterface>) =>
  await userDbRepository.getAllUsers();

export const getOwners = async (
  ownerDbRepository: ReturnType<ownerDbInterfaceType>
) => await ownerDbRepository.getAllOwners();

