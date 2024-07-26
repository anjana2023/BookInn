import mongoose from "mongoose";
import { HotelEntityType } from "../../entities/hotel";
import { RoomEntityType } from "../../entities/room";
import Hotel from "../../frameworks/database/models/hotelModel";
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { RatingEntityType } from "../../entities/rating";

export const hotelDbInterface = (
  repository: ReturnType<hotelDbRepositoryType>
) => {
  const addHotel = async (hotel: HotelEntityType) =>
    await repository.addHotel(hotel);

  const addRoom = async (
    hotel: RoomEntityType,
    hotelId: mongoose.Types.ObjectId
  ) => await repository.addRoom(hotel, hotelId)

  const addStayType = async (name:string) =>
    await repository.addStayType(name)

  
  const getHotelByName = async (name: string) =>
    await repository.getHotelByName(name);

  const getHotelByEmail = async (email: string) =>
    await repository.getHotelEmail(email);

  const getAllHotels=async()=>
    await repository.getAllHotels()

  const getUserHotels = async () => await repository.getUserHotels();

  const getMyHotels = async (ownerId: string) =>{
   const res= await repository.getMyHotels(ownerId);
   console.log(res,"//////result")
   return res

  }

  const getHotelDetails=async(id:string)=>
    await repository.getHotelDetails(id)


  const updateHotel = async (id: string, updates: HotelEntityType) =>
    await repository.update(id, updates)


  const addUnavilableDates = async (room: [], dates: string[]) =>
    await repository.addUnavilableDates(room, dates)

  const removeUnavailableDates = async (room: [], dates: string[]) =>
    await repository.removeUnavailableDates(room, dates)

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


  const filterHotels = async (
    place: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string,
    amenities: string,
    minPrice: string,
    maxPrice: string,
    categories: string,
    skip: number,
    limit: number
  ) =>
  {const data= await repository.filterHotels(
      place,
      adults,
      children,
      room,
      startDate,
      endDate,
      amenities,
      minPrice,
      maxPrice,
      categories,
      skip,
      limit
    )
    return data
  }

    const UserfilterHotelBYId = async (
      id: string,
      adults: string,
      children: string,
      room: string,
      startDate: string,
      endDate: string,
      minPrice: string,
      maxPrice: string
    ) =>
      await repository.UserfilterHotelBYId(
        id,
        adults,
        children,
        room,
        startDate,
        endDate,
        minPrice,
        maxPrice
      )


      const addRating = async (ratingData: RatingEntityType) =>
        await repository.addRating(ratingData)
    
      const getRatings = async (filter: Record<string, any>) =>
        await repository.getRatings(filter)
    
      const getRatingById = async (id: string) => await repository.getRatingById(id)
    
      const updateRatings = async (id: string, updates: Record<string, any>) =>
        await repository.updateRatingById(id,updates)
  
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
    getAllBookings,
    addRoom,
    addStayType,
    addUnavilableDates,
    removeUnavailableDates,
    filterHotels,
    UserfilterHotelBYId,
    addRating,
    getRatings,
    getRatingById,
    updateRatings
    
  };
};

export type hotelDbInterfaceType = typeof hotelDbInterface;
