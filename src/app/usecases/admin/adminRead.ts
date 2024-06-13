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
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface";

export const getUsers = async (userDbRepository: ReturnType<userDbInterface>) =>
  await userDbRepository.getAllUsers();

export const getOwners = async (
  ownerDbRepository: ReturnType<ownerDbInterfaceType>
) => await ownerDbRepository.getAllOwners();

export const fetchAllBookings = async (hotelDbRepository: ReturnType<hotelDbInterfaceType>) =>
  await hotelDbRepository.getAllBookings();
