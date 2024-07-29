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
import { bookingDbInterfaceType } from "../../interfaces/bookingDbInterface";

export const getUsers = async (userDbRepository: ReturnType<userDbInterface>) =>
  await userDbRepository.getAllUsers();

export const getOwners = async (
  ownerDbRepository: ReturnType<ownerDbInterfaceType>
) => await ownerDbRepository.getAllOwners();

export const fetchAllBookings = async (hotelDbRepository: ReturnType<hotelDbInterfaceType>) =>
  await hotelDbRepository.getAllBookings();

export const addStayType=async(
  name:string,
  hotelDbRepository: ReturnType<hotelDbInterfaceType>
)=>await hotelDbRepository.addStayType(name)

export const getALLBookings = async (
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getAllBooking()
