import hotel from "../../../entities/hotel";
import createHotelEntity, { HotelEntityType } from "../../../entities/hotel";
import Hotel from "../../../frameworks/database/models/hotelModel";
import { HotelInterface } from "../../../types/hotelInterface";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
import { hotelVerificationRejectedEmailPage } from "../../../utils/hotelVerifcationRejectionEmail";
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface";
import sendMail from "../../../utils/sendMail";
import mongoose from "mongoose";
import { RoomInterface } from "../../../types/RoomInterface";
import createRoomEntity,{ RoomEntityType } from "../../../entities/room";

export const addHotel = async (
  ownerId: string,
  hotel: HotelInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const {
    name,
    email,
    place,
    description,
    propertyRules,
    stayType,
    address,
    amenities,
    imageUrls,
    hotelDocument,
  } = hotel;
  console.log("hotel usecase ............");
  const existingHotel = await hotelRepository.getHotelByName(name);
  const existingEmail = await hotelRepository.getHotelByEmail(email);
  if (existingHotel) {
    throw new AppError(
      "Hotel with this name already exists",
      HttpStatus.UNAUTHORIZED
    );
  }
  if (existingEmail) {
    throw new AppError(
      "Email with this email already exists",
      HttpStatus.UNAUTHORIZED
    );
  }
  const hotelEntity: HotelEntityType = createHotelEntity(
    name,
    email,
    ownerId,
    place,
    description,
    propertyRules,
    stayType,
    address,
    amenities,
    imageUrls,
    hotelDocument
  );

  const newHotel = await hotelRepository.addHotel(hotelEntity);

  return newHotel;
};

export const addRoom = async (
  hotelId: mongoose.Types.ObjectId,
  hotel: RoomInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  console.log(hotelId, "hotel");

  const { title, price, desc, maxChildren, maxAdults, roomNumbers } = hotel;

  // Correctly map the roomNumbers array
  const formattedRoomNumbers = roomNumbers.map((num: number) => ({
    number: num,
    unavailableDates: []
  }));

  console.log(formattedRoomNumbers, "formattedRoomNumbers");

  const roomEntity: RoomEntityType = createRoomEntity(
    title,
    price,
    desc,
    maxChildren,
    maxAdults,
    formattedRoomNumbers
  );

  const newHotel = await hotelRepository.addRoom(roomEntity, hotelId);

  return newHotel;
}



export const getHotels = async (
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getAllHotels();

export const getHotel = async (
  id: string,
  status: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getHotel(id, status);

export const getMyHotels = async (
  ownerId: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getMyHotels(ownerId);

export const getHotelRejected = async (
  id: string,
  status: string,
  reason: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  await hotelRepository.getHotelByIdUpdateRejected(id, status, reason);
  const hotel = await hotelRepository.getHotelById(id);
  const { name, email } = hotel as unknown as { name: string; email: string };
  if (hotel) {
    const emailSubject = "Verification Rejected";
    sendMail(
      email,
      emailSubject,
      hotelVerificationRejectedEmailPage(name, reason)
    );
  } else {
    console.error("Doctor not found");
  }
};

export const HotelRejected = async (
  hotelID: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const doctor = await hotelRepository.getRejectedHotelById(hotelID);
  return doctor;
};

export const updateHotel=async(
  hotelId:string,
  updates:any,
  hotelRepository: ReturnType<hotelDbInterfaceType>

)=>await hotelRepository.updateHotel(hotelId,updates)

export const blockHotel = async (
  id: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const hotel = await hotelRepository.getHotelById(id);
  if (!hotel) {
    throw new Error("Hotel not found");
  }
  const updatedHotel = await hotelRepository.updateHotelBlock(
    id,
    !hotel.isBlocked
  );
  return updatedHotel;
};
