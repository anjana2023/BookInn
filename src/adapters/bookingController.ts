import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express"
 import { hotelDbInterfaceType } from "../app/interfaces/hotelDbInterface";
import { bookingDbRepositoryType } from "../frameworks/database/repositories/bookingRepositoryMongoDB";
import { hotelDbRepositoryType } from "../frameworks/database/repositories/hotelRepositoryMongoDB";
import { HotelServiceType } from "../frameworks/servies/hotelServices";
import { HttpStatus } from "../types/httpStatus";
import { getUserProfile } from "../app/usecases/User/read&write/profile";
import { userDbInterface } from "../app/interfaces/userDbRepositories";
import { userRepositoryMongoDB } from "../frameworks/database/repositories/userRepositoryMongoDB";
import { bookingDbInterfaceType }from "../app/interfaces/bookingDbInterface";
import createBooking,{getBookingByBookingId, getBookingByHotelId, getBookingByUserId, makePayment, updateBookingStatus, updateBookingStatusPayment} from "../app/usecases/Booking/booking";
import { HotelServiceInterface } from "../app/service-interface/hotelServices";


export default function bookingController(
    bookingDbRepository: bookingDbInterfaceType,
    bookingDbRepositoryImp: bookingDbRepositoryType,
    hotelDbRepository: hotelDbInterfaceType,
    hotelDbRepositoryImpl: hotelDbRepositoryType,
    hotelServiceInterface: HotelServiceInterface,
    hotelServiceImpl: HotelServiceType,
    userDbRepository: userDbInterface,
    userDbRepositoryImpl: userRepositoryMongoDB

  ) {
    const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp())
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl())
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const hotelService=hotelServiceInterface(hotelServiceImpl())

    const handleBooking = expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const bookingDetails = req.body;
          const userId = req.user;
          console.log(userId);
    
          const data = await createBooking(
            userId,
            bookingDetails,
            dbRepositoryBooking,
            dbRepositoryHotel,
            hotelService
          );
          console.log(data,"vhjvxsgc  vbvzCVbvcvc")
    
          if (data && data.paymentMethod === "Online") {
            const user = await getUserProfile(userId, dbRepositoryUser);
            
    
            if (typeof data.price === 'number') {
              console.log("before payment");
              
              const sessionId = await makePayment(
                user?.name,
                user?.email,
                data._id.toString(),
                data.price
              );
              console.log("after,.....................................");
              
              res.status(HttpStatus.OK).json({
                success: true,
                message: "Booking created successfully",
                id: sessionId,
              });
            } else {
              throw new Error('Invalid price for online payment');
            }
          } else {
            res.status(HttpStatus.OK).json({
              success: true,
              message: "Booking created successfully using Wallet",
              booking: data,
            });
          }
        } catch (error) {
          next(error);
        }
      }
    );

    const updatePaymentStatus = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { id } = req.params;
        console.log("nnnn")
        const { paymentStatus } = req.body;
       console.log()
        const updateStatus = await updateBookingStatusPayment(
        id,
        dbRepositoryBooking,
        )
  
  
        await updateBookingStatus(
          id,
          paymentStatus,
          dbRepositoryBooking,
        );
        res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Booking status updated" });
      } catch (error) {
        next(error)
  
      }
    }


    // const cancelBooking = async(
    //   req:Request,
    //   res:Response,
    //   next:NextFunction
    // )=>{
    //   try {
    //     const {BookingStatus} = req.body;
    //     const {cancelReason} = req.body;
    //     const {id} = req.params;
  
    //     const updateBooking = await changeBookingstaus(
    //       BookingStatus,
    //       cancelReason,
    //       id,
    //       dbRepositoryBooking
    //     );
  
    //     res
    //       .status(HttpStatus.OK)
    //       .json({ success: true, message: "Cancel Appoinment" });
  
    //   } catch (error) {
    //     next(error)
    //   }
    // }


    const getBookingDetails = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { id } = req.params;
        console.log(id,"ndascjhbdhuabvcydwagsvcgadvc")
        const  data  = await getBookingByBookingId(
          id,
          dbRepositoryBooking
        );
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Bookings details fetched successfully",
          data,
        });
      } catch (error) {
        next(error);
      }
    };
  
    const getAllBookingDetails = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const  {id}  = req.params;
        const  data  = await getBookingByUserId(
          id,
          dbRepositoryBooking
        );
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Bookings details fetched successfully",
          data,
        });
      } catch (error) {
        next(error);
      }
    };
  
  
    /**
     * *METHOD :GET
     * * Retrieve all bookings done by user
     */
    const getAllBooking= async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userID = req.user;
        const bookings = await getBookingByUserId(userID, dbRepositoryBooking);
        console.log(bookings,"bookingssssssssssss")

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Bookings fetched successfully",
          bookings,
        });
      } catch (error) {
        next(error);
      }
    };
  
  
    /*
     * * METHOD :GET
     * * Retrieve booking details by hotel id
     */
    const getBookingList = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const  {id}  = req.params;
        const  data  = await getBookingByHotelId(
          id,
          dbRepositoryBooking
        );
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Bookings details fetched successfully",
          data,
        });
      } catch (error) {
        next(error);
      }
    };
  
  

    return{
      handleBooking,
      updatePaymentStatus,
      getBookingDetails,
      getAllBookingDetails,
      getAllBooking,
      getBookingList
    }
}