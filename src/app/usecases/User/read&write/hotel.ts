import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface"



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