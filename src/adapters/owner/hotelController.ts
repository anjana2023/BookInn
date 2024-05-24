import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { Request, Response, NextFunction } from "express";
import { addHotel, blockHotel, getMyHotels, updateHotel } from "../../app/usecases/owner/hotel";
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";
import { HttpStatus } from "../../types/httpStatus";
import { getHotelDetails, getUserHotels } from "../../app/usecases/User/read&write/hotel";

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

const hotelController = (
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());

  const registerHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user;
      const hotelData = req.body;
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

  const registeredHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.owner;
      console.log(ownerId,"........deadsfaewfdwf");

      const Hotels = await getMyHotels(ownerId, dbRepositoryHotel);
      console.log(Hotels,"//////////////////registered hotel controller")


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

  const hotelDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;

    
      const Hotel = await getHotelDetails(id, dbRepositoryHotel);

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
      const hotels = req.body
      const hotelId= hotels._id
 
      const updateData = req.body;
      const hotel = await updateHotel(hotelId, updateData, dbRepositoryHotel);
      console.log(hotel,"...................................hotebjwhbbahdzgvchasDgjbhvvvvvvvvvvvvvvvvvvvvvvvv")
      res
        .status(200)
        .json({ success: true, hotel, message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  const hotelBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      
      const updatedHotel = await blockHotel(id, dbRepositoryHotel);
      console.log(updatedHotel,".........................................................updatedHotel")
  
      return res.status(HttpStatus.OK).json({ 
        success: true, 
        message: "Hotel block status updated successfully", 
        hotel: updatedHotel 
      });
    } catch (error) {
      next(error);
    }
  };
  





  return {
    registerHotel,
    registeredHotels,
    getHotelsUserSide,
    hotelDetails,
    updateHotelInfo,
    hotelBlock
  };
};

export default hotelController;
