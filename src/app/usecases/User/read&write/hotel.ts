import mongoose from "mongoose"
import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface"
import ratingEntity from "../../../../entities/rating"



export const getUserHotels=async(
    hotelRepository:ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.getUserHotels()

export const getHotelDetails=async(
    id:string,
    hotelRepository:ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.getHotelDetails(id)


  export const filterHotels = async (
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
    hotelRepository: ReturnType<hotelDbInterfaceType>,
    skip: number,
    limit: number
  ) => {
    const data = await hotelRepository.filterHotels(
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
  

  export const hotelDetailsFilter = async (
    id: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string,
    minPrice: string,
    maxPrice: string,
    hotelRepository: ReturnType<hotelDbInterfaceType>
  ) => {
    const data = await hotelRepository.UserfilterHotelBYId(
      id,
      adults,
      children,
      room,
      startDate,
      endDate,
      minPrice,
      maxPrice
    )
    return data
  }

  export const addNewRating = async (
    userId: string,
    ratingData: {
      hotelId: string
      rating: number
      description: string
      imageUrls: string[]
    },
    hotelRepository: ReturnType<hotelDbInterfaceType>
  ) => {
    const { hotelId, rating, description, imageUrls } = ratingData
    const newRatingEntity = ratingEntity(
      userId,
      hotelId,
      rating,
      description,
      imageUrls
    )
  
    return await hotelRepository.addRating(newRatingEntity)
  }

  export const ratings = async (
    hotelID: string,
    hotelRepository: ReturnType<hotelDbInterfaceType>
  ) => await hotelRepository.getRatings({ hotelId: hotelID })
  

    export const ReviewsByUserId = async (
      userID: string,
      hotelID: mongoose.Types.ObjectId,
      hotelRepository: ReturnType<hotelDbInterfaceType>
    ) =>
      await hotelRepository.getRatings({
        userId: userID,
        hotelId: hotelID,
      })
    
    export const ReviewById = async (
      id: string,
      hotelRepository: ReturnType<hotelDbInterfaceType>
    ) => await hotelRepository.getRatingById(id)
    
    export const updateReviewById = async (
      id: string,
      updates: Record<string, any>,
      hotelRepository: ReturnType<hotelDbInterfaceType>
    ) => await hotelRepository.updateRatings(id, updates)