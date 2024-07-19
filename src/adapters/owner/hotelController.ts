import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { Request, Response, NextFunction } from "express";
import { HotelRejected, addHotel, addRoom, blockHotel, getMyHotels, updateHotel } from "../../app/usecases/owner/hotel";
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";
import { HttpStatus } from "../../types/httpStatus";
import { filterHotels, getHotelDetails, getUserHotels, hotelDetailsFilter } from "../../app/usecases/User/read&write/hotel";
import { checkAvailability, getBookingsByHotels } from "../../app/usecases/Booking/booking";
import mongoose from "mongoose";
import { bookingDbInterfaceType } from "../../app/interfaces/bookingDbInterface";
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB";

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

const hotelController = (
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType,
  bookingDbRepository: bookingDbInterfaceType,
  bookingDbRepositoryImp: bookingDbRepositoryType,

) => {
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
  
  const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp())
  const registerHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.owner;
      const hotelData = req.body;
      console.log(hotelData,"data from adddggggggdddd");
      
      const registeredHotel = await addHotel(ownerId, hotelData, dbRepositoryHotel);
      res.json({
        status: "success",
        message: "Hotel added successfully",
        registeredHotel,
      });
    } catch (error) {
      next(error);
    }
  };

  
  const registerRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const hotelId = new mongoose.Types.ObjectId(req.params.id)
      console.log(hotelId)
      console.log(req.body, "data")

      const roomData = req.body

      const registeredRoom = await addRoom(
        hotelId,
       roomData,
        dbRepositoryHotel
      )
      res.json({
        status: "success",
        message: "room added suuccessfully",
        registeredRoom,
      })
    } catch (error) {
      next(error)
    }
  }

  const registeredHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId= req.owner;
      const Hotels = await getMyHotels(ownerId, dbRepositoryHotel);
   return res.status(HttpStatus.OK).json({ success: true, Hotels });
    } catch (error) {
      next(error);
    }
  };

  const getHotelsUserSide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.user) {
        const Hotels = await getUserHotels(dbRepositoryHotel);
        return res.status(HttpStatus.OK).json({ success: true, Hotels });
      }
    } catch (error) {
      next(error);
    }
  };

  const destinationSearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.query, "all values")
      const place = req.query.destination as string
      const adults = req.query.adult as string
      const children = req.query.children as string
      const room = req.query.room as string
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string
      const amenities = req.query.amenities as string
      const minPrice = req.body.minPrice as string
      const maxPrice = req.body.maxPrice as string
    
      const stayTypes = req.query.stayTypes as string
      const page = parseInt(req.query.pages as string) || 1
      const limit = 2
      const skip = (page - 1) * limit
      console.log(skip, limit, "...............")

      const data = await filterHotels(
        place,
        adults,
        children,
        room,
        startDate,
        endDate,
        amenities,
        minPrice,
        maxPrice,
        stayTypes,
        dbRepositoryHotel,
        skip,
        limit
      )
      res.status(HttpStatus.OK).json({
        status: "success",
        message: "search result has been fetched",
        data: data,
      })
    } catch (error) {
      next(error)
    }
  }

  const DetailsFilter = async (
  req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.query, "all values")
      const id = req.query.id as string
      const adults = req.query.adult as string
      const children = req.query.children as string
      const room = req.query.room as string
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string
      const minPrice = req.body.minPrice as string
      const maxPrice = req.body.maxPrice as string

      const data = await hotelDetailsFilter(
        id,
        adults,
        children,
        room,
        startDate,
        endDate,
        minPrice,
        maxPrice,
        dbRepositoryHotel
      )
      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Hotel details fetched",
        data,
      })
    } catch (error) {
      next(error)
    }
  }



  const hotelDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
    console.log('heloooooo')
    
      const Hotel = await getHotelDetails(id, dbRepositoryHotel);
      console.log(Hotel)
      return res.status(HttpStatus.OK).json({ success: true, Hotel });
    } catch (error) {
      next(error);
    }
  };

  const updateHotelInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
      try {
        const { id } = req.params
        console.log("edit,,,,,,,,,,",id)
        const result = await updateHotel(id, req.body, dbRepositoryHotel)
        if (result) {
          return res
            .status(HttpStatus.OK)
            .json({ success: true, message: "  Successfully updated" })
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({ success: false })
        }
      } catch (error) {
        next(error)
      }
    }

  const hotelBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      
      const updatedHotel = await blockHotel(id, dbRepositoryHotel);
  
      return res.status(HttpStatus.OK).json({ 
        success: true, 
        message: "Hotel block status updated successfully", 
        hotel: updatedHotel 
      });
    } catch (error) {
      next(error);
    }
  };
  
  const getHotelRejected = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const doctor = await HotelRejected(id,dbRepositoryHotel);
      return res.status(HttpStatus.OK).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }


  const checkAvilabitiy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dates = req.body
      const id = req.params.id
      const isDateExisted=await checkAvailability( id,dates,dbRepositoryHotel)
      console.log(isDateExisted);
      
      // if(!isDateExisted){
      //   console.log("hloooo");
        
      //   res.status(HttpStatus.OK).json({
      //     status: "success",
      //     message: "date is availble"
      //   })
      // }else{
      //   res.status(HttpStatus.OK).json({
      //     status: "fail",
      //     message: "date is unavailble"
      //   })
      // }
      
    } catch (error) {
      next(error)
      
    }
  }

  const getOwnerBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.owner
      console.log(userID)
      
      const hotels = await getMyHotels(userID, dbRepositoryHotel)

      console.log(hotels,"$$$$$$$$$$$$$$$$$$$$$$$");
      
      const HotelIds: string[] = hotels.map((hotel) => hotel._id.toString());
      console.log(HotelIds,"-----------------------------------------------------------");

      const bookings=await getBookingsByHotels(HotelIds,dbRepositoryBooking)
      console.log(bookings);
      
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      })
    } catch (error) {
      next(error)
    }
  }




  return {
    registerHotel,
    registerRoom,
    registeredHotels,
    getHotelsUserSide,
    hotelDetails,
    updateHotelInfo,
    hotelBlock,
    getOwnerBookings,
    checkAvilabitiy,
    getHotelRejected,
    destinationSearch,
    DetailsFilter
  };
};

export default hotelController;
