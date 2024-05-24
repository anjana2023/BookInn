import hotel from "../../../entities/hotel";
import createHotelEntity,{ HotelEntityType } from "../../../entities/hotel";
import Hotel from "../../../frameworks/database/models/hotelModel";
import { HotelInterface } from "../../../types/hotelInterface";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
import {  hotelVerificationRejectedEmailPage } from "../../../utils/docterVerifcationRejectionEmail";
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface";
import sendMail from "../../../utils/sendMail";

export const addHotel = async (
  ownerId:string,
  hotel: HotelInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const {
    name,
    email,
    place,
    description,
    propertyRules,
    aboutProperty,
    rooms,
    amenities,
    image
  } = hotel;
  console.log("hotel usecase ............")
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
    aboutProperty,
    rooms,
    amenities,
    image
  );

  const newHotel = await hotelRepository.addHotel(hotelEntity);

  return newHotel;
};
export const getHotels=async(
  hotelRepository:ReturnType<hotelDbInterfaceType>,
)=>await  hotelRepository.getAllHotels();

export const getHotel=async(
  id:string,status:string, hotelRepository:ReturnType<hotelDbInterfaceType>,
)=>await  hotelRepository.getHotel(id,status);




export const getMyHotels=async(
  ownerId:string,
  hotelRepository:ReturnType<hotelDbInterfaceType>,
)=>
  await hotelRepository.getMyHotels(ownerId)



  export const getHotelRejected = async ( id: string,status:string,reason:string ,hotelRepository: ReturnType<hotelDbInterfaceType>) =>{
    await hotelRepository.getHotelByIdUpdateRejected(id,status,reason);
    const hotel =await hotelRepository.getHotelById(id);
    if(hotel){
      const hotelName = hotel.name;
      const email = hotel.email;
      const emailSubject = "Verification Rejected";
      sendMail(email,emailSubject,hotelVerificationRejectedEmailPage(hotelName,reason))
    }else{
      console.error ("Doctor not found");
    }
  }
  
  export const updateHotel = async (
    HotelID: string,
    updateData: HotelInterface,
    hotelRepository: ReturnType<hotelDbInterfaceType>
  ) => await hotelRepository.updateHotel(HotelID, updateData);
  

  
  export const blockHotel = async (
    id: string,
    hotelRepository: ReturnType<hotelDbInterfaceType>
  ) => {
    const hotel = await hotelRepository.getHotelById(id);
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    const updatedHotel = await hotelRepository.updateHotelBlock(id, !hotel.isBlocked);
    return updatedHotel;
  };
  
