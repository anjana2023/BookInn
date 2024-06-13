import { HotelEntityType } from "../../entities/hotel";
import Hotel from "../../frameworks/database/models/hotelModel";
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";

export const hotelDbInterface = (
  repository: ReturnType<hotelDbRepositoryType>
) => {
  const addHotel = async (hotel: HotelEntityType) =>
    await repository.addHotel(hotel);

  
  const getHotelByName = async (name: string) =>
    await repository.getHotelByName(name);

  const getHotelByEmail = async (email: string) =>
    await repository.getHotelEmail(email);

  const getAllHotels=async()=>
    await repository.getAllHotels()

  const getUserHotels = async () => await repository.getUserHotels();

  const getMyHotels = async (ownerId: string) =>
    await repository.getMyHotels(ownerId);

  const getHotelDetails=async(id:string)=>
    await repository.getHotelDetails(id)


  const updateHotel = async (hotelID:string, hotelData : Record<string,any>)=>await repository.updateHotelInfo(hotelID,hotelData);


  const getHotel=async(id:string,status:string)=>
    await repository.getHotel(id,status)

  const getRejectedHotelById = async (id: string) =>await repository.getRejectedHotelById(id);

  const getHotelByIdUpdateRejected = async (id: string, status:string,reason:string) =>await repository.getHotelByIdUpdateRejected(id,status,reason);


  const getHotelById = async (id: string) =>await repository.getHotelById(id);


  const updateHotelBlock = async (id: string, status: boolean) =>
    await repository.updateHotelBlock(id, status);

  
  const updateUnavailableDates = async (id: string, dates: any) =>
    await repository.updateUnavailableDates(id, dates)

  const checkAvailability= async (id: string, checkInDate:string,checkOutDate:string) =>
    await repository.checkAvailability(id,checkInDate,checkOutDate)

  const getAllBookings = async () => await repository.getAllBookings();


  return {
    addHotel,
    getHotelByName,
    getHotelByEmail,
    getAllHotels,
    getUserHotels,
    getMyHotels,
    getHotelDetails,
    getHotel,
    getRejectedHotelById,
    getHotelByIdUpdateRejected,
    getHotelById,
    updateHotel,
    updateHotelBlock,
    updateUnavailableDates,
    checkAvailability,
    getAllBookings
  };
};

export type hotelDbInterfaceType = typeof hotelDbInterface;
