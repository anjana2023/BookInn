import { HotelInterface, RoomInterface } from './../../../types/hotelInterface';
import { HotelEntityType } from "../../../entities/hotel"
import Hotel from "../models/hotelModel"
import Booking from '../models/bookingModel';
import Room from '../models/roomModel';
import mongoose from 'mongoose';
import { RoomEntityType } from '../../../entities/room';
import Category from '../models/categoryModel';

export const hotelDbRepository=()=>{
    const addHotel=async(hotel:HotelEntityType)=>{
        const newHotel:any=new Hotel({
         name:hotel.getName(),
            email:hotel.getEmail(),
            place:hotel.getPlace(),
            address: hotel.getAddress(),
            ownerId:hotel.getOwnerId(),
            description:hotel.getDescription(),
            propertyRules:hotel.getPropertyRules(),
            stayType: hotel.getStayType(),
            amenities:hotel.getAmenities(),
            imageUrls: hotel.getImageUrls(),
            hotelDocument: hotel.getHotelDocument(),
        })
       await newHotel.save();
        return newHotel
    }


    const addRoom = async (
      room: RoomEntityType,
      hotelId: mongoose.Types.ObjectId
    ) => {
      const newRoom: any = new Room({
        title: room.getTitle(),
        price: room.getPrice(),
        maxChildren: room.getMaxChildren(),
        maxAdults: room.getMaxAdults(),
        desc: room.getDescription(),
        roomNumbers: room.getRoomNumbers(),
      })
      try {
        const savedRoom = await newRoom.save()
        try {
          await Hotel.findByIdAndUpdate(hotelId, {
            $push: { rooms: savedRoom._id },
          })
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
      return newRoom
    }
  
    const addStayType= async (
      name: string,
    ) => {
      const newCategory: any = new Category({
        title: name,
      }) 
      newCategory.save()
      return newCategory
    }
  
    const deleteRoom = async (
      roomId: mongoose.Types.ObjectId,
      hotelId: mongoose.Types.ObjectId
    ) => {
      try {
        await Room.findByIdAndDelete(roomId)
        try {
          await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } })
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    interface RoomDetails {
      roomId: string;
      roomNumbers: number[];
    }
    
    const  addUnavilableDates= async (
      rooms: RoomDetails[],
      dates: string[]
    ) => {
        for (const room of rooms) {
        const roomId = room.roomId;
        const roomNumbers = room.roomNumbers;
    
        for (const roomNumber of roomNumbers) {
          await Room.updateOne(
            { _id: roomId, "roomNumbers.number": roomNumber },
            { $addToSet: { "roomNumbers.$.unavailableDates": { $each: dates } } }
          );
        }
      }
    
     return
    };
  
    const removeUnavailableDates = async (rooms: RoomDetails[], dates: string[]) => {
      for (const room of rooms) {
        const roomId = room.roomId;
        const roomNumbers = room.roomNumbers;
    
        for (const roomNumber of roomNumbers) {
          await Room.updateOne(
            { _id: roomId, "roomNumbers.number": roomNumber },
            { $pull: { "roomNumbers.$.unavailableDates": { $in: dates } } }
          );
        }
      }
    
      return;
    };


    const getHotelByName=async(name:string)=>{
        const hotel:HotelInterface|null=await Hotel.findOne({name})
        return hotel
    }
    const getHotelEmail = async (email: string) => {
        const user: HotelInterface| null = await Hotel.findOne({ email });
        return user;
      };
      const getAllHotels=async()=>{
        const Hotels=await Hotel.find({})
        return Hotels
      } 
    
      const getUserHotels = async () => {
        const Hotels = await Hotel.find({});
        return Hotels;
      };
      const getMyHotels = async (ownerId: string) => {
        const Hotels = await Hotel.find({ ownerId });
     console.log(Hotels,"^^^^^^^^^^^^^^^^^^^^^^^^^^")
        return Hotels;
      };
    
      const getHotelDetails = async (id: string) => {
        const Hotels = await Hotel.findById(id).populate("rooms").populate("ownerId")
        return Hotels
      }

const getHotel=async(id:string,status:string)=>await Hotel.findByIdAndUpdate(id,{status:status,isApproved:true}).select("-password -isApproved ")


const getRejectedHotelById = async (id: string) =>
  await Hotel.findByIdAndUpdate(id,{status:"pending"}).select(
    "-password -isVerified -isApproved -isRejected"
); 

const getHotelById = async (id: string) =>
  await Hotel.findById(id).select(
    "-password -isVerified -isApproved -isRejected -verificationToken "
  );


  const updateHotelBlock = async (id: string, status: boolean) =>
    await Hotel.findByIdAndUpdate(id, { isBlocked: status });


  const update = async (id: string, updates: HotelEntityType) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
    })
    return updatedHotel
  }


const getHotelByIdUpdateRejected = async (id: string,status:string,reason:string) =>await Hotel.findByIdAndUpdate(id,{status:status, isApproved:false, rejectedReason:reason}).select("-password -isVerified -isApproved ");


const updateUnavailableDates = async (id: string, dates: any) =>
  await Hotel.updateOne(
    { _id: id },
    { $addToSet: { unavailableDates: { $each: dates } } }
  )
  const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  };
       
  const checkAvailability = async (id: string, checkInDate: string, checkOutDate: string) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    const hotel = await Hotel.findById(id).select("unavailableDates");
  
  };
  
  const getAllBookings = async () => await Booking.find({ status: "Booked" }); 
  
  const splitDate = (dateString: string) => {
    const [date, time] = dateString.split("T")
    const timeWithoutZ = time.replace("Z", "") // Remove 'Z' from time
    return { date, time: timeWithoutZ }
  }

  const getDates = async (startDate: any, endDate: any) => {
    console.log(startDate, endDate, "😀")

    const currentDate = new Date(startDate)
    const end = new Date(endDate)
    console.log(currentDate, end, "😄")

    const datesArray: string[] = []

    while (currentDate <= end) {
      const formattedDate = new Date(currentDate)
      formattedDate.setUTCHours(0, 0, 0, 0)
      datesArray.push(formattedDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return datesArray
  }

  const filterHotels = async (
    destination: string,
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
  ) => {
    let hotels: any[]

    if (destination) {
      const regex = new RegExp(destination, "i")
      hotels = await Hotel.find({
        $or: [{ destination: { $regex: regex } }, { name: { $regex: regex } }],
        isVerified: "verified",
        isListed: true,
        isBlocked: false,
      }).populate("rooms")
    } else {
      hotels = await Hotel.find({
        isVerified: "verified",
        isListed: true,
        isBlocked: false,
      }).populate("rooms")
    }

    const adultsInt = adults ? parseInt(adults) : 0
    const childrenInt = children ? parseInt(children) : 0

    hotels = hotels.filter((hotel: HotelInterface) => {
      const filteredRooms = hotel.rooms.filter((room: RoomInterface) => {
        return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt
      })
      if (filteredRooms.length > 0) {
        hotel.rooms = filteredRooms
        return true
      }
      return false
    })

    const start = splitDate(startDate)
    const end = splitDate(endDate)
    const dates = await getDates(start.date, end.date)

    const isRoomNumberAvailable = (roomNumber: {
      number: number
      unavailableDates: Date[]
    }): boolean => {
      return !roomNumber.unavailableDates.some((date: Date) => {
        const curr = new Date(date).toISOString().split("T")[0]
        return dates.includes(curr)
      })
    }

    if (minPrice && maxPrice && parseInt(maxPrice) !== 0) {
      const minPriceInt = parseInt(minPrice)
      const maxPriceInt = parseInt(maxPrice)
      console.log(minPriceInt, "-----", maxPriceInt)

      hotels = hotels.filter((hotel: HotelInterface) => {
        const filteredRooms = hotel.rooms.filter((room: RoomInterface) => {
          const result =
            room.price !== undefined &&
            room.price >= minPriceInt &&
            room.price <= maxPriceInt
          return result
        })
        if (filteredRooms.length > 0) {
          hotel.rooms = filteredRooms
          return true
        }
        return false
      })
    }
    console.log(hotels, " before   hotelssssssssss")

    if (amenities) {
      const amenitiesArr = amenities.split(",")
      hotels = hotels.filter(hotel => {
        return amenitiesArr.every(amenity => hotel.amenities.includes(amenity))
      })
    }

    console.log(hotels, "hotelssssssssss")
    const paginatedHotels = hotels.slice(skip, skip + limit)

    return paginatedHotels
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
  ) => {
    try {
      // Fetch the hotel by ID and populate rooms
      const hotel = await Hotel.findById(id).populate("rooms")

      if (!hotel) {
        throw new Error("Hotel not found")
      }

      // Convert string inputs to numbers
      const adultsInt = adults ? parseInt(adults) : 0
      const childrenInt = children ? parseInt(children) : 0

      // Filter rooms based on max adults and children
      hotel.rooms = hotel.rooms.filter((room: any) => {
        return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt
      })

      // Split start and end dates into parts
      const start = splitDate(startDate)
      const end = splitDate(endDate)

      // Get dates between start and end date
      const dates = await getDates(start.date, end.date)

      // Function to check room availability
      const isRoomNumberAvailable = (roomNumber: {
        number: number
        unavailableDates: Date[]
      }): boolean => {
        return !roomNumber.unavailableDates.some((date: Date) => {
          const curr = new Date(date).toISOString().split("T")[0]
          return dates.includes(curr)
        })
      }

      // Filter rooms again based on availability
      hotel.rooms.forEach((room: any) => {
        room.roomNumbers = room.roomNumbers.filter(isRoomNumberAvailable)
      })

      // Filter out rooms that have no available room numbers
      hotel.rooms = hotel.rooms.filter(
        (room: any) => room.roomNumbers.length > 0
      )

      // Return the hotel with filtered rooms
      console.log(hotel, "Filtered hotel with available rooms")
      return hotel
    } catch (error) {
      console.error("Error filtering hotel:", error)
      throw error
    }
  }




    return{
        addHotel,
        getHotelByName,
        getHotelEmail,
        getAllHotels,
        getUserHotels,
        getMyHotels,
        getHotelDetails,
        getHotel,
        getRejectedHotelById,
        getHotelByIdUpdateRejected,
        getHotelById,
        update,
        updateHotelBlock,
        updateUnavailableDates,
        checkAvailability,
        getAllBookings,
        addRoom,
        addStayType,
        UserfilterHotelBYId,
        addUnavilableDates,
        deleteRoom,
        removeUnavailableDates,
        filterHotels
      
        // getHotelbyId
    }
}
export type hotelDbRepositoryType=typeof hotelDbRepository;