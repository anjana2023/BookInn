import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express"
 import { hotelDbInterfaceType } from "../app/interfaces/hotelDbInterface";
import { bookingDbRepositoryType } from "../frameworks/database/repositories/bookingRepositoryMongoDB";
import { hotelDbRepositoryType } from "../frameworks/database/repositories/hotelRepositoryMongoDB";
import { HotelServiceType } from "../frameworks/servies/hotelServices";
import { HttpStatus } from "../types/httpStatus";
import { WalletTransactions, getUserProfile, getWalletUser } from "../app/usecases/User/read&write/profile";
import { userDbInterface } from "../app/interfaces/userDbRepositories";
import { userRepositoryMongoDB } from "../frameworks/database/repositories/userRepositoryMongoDB";
import { bookingDbInterfaceType }from "../app/interfaces/bookingDbInterface";
import createBooking,{addUnavilableDates, cancelBookingAndUpdateWallet, changeWallet, changeWalletAmounti, getBookingByBookingId, getBookingByHotelId, getBookingByUserId, getBookingsByHotels, getTransaction, getWalletBalance, makePayment, removeUnavilableDates, updateBookingDetails, updateBookingStatus, updateBookingStatusPayment, walletDebit} from "../app/usecases/Booking/booking";
import { HotelServiceInterface } from "../app/service-interface/hotelServices";
import { getMyHotels } from "../app/usecases/owner/hotel";
import { bookingService } from "../frameworks/servies/bookingService";
import { bookingServiceInterface } from "../app/service-interface/bookingService";


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
        
    
          const data = await createBooking(
            userId,
            bookingDetails,
            dbRepositoryBooking,
            dbRepositoryHotel,
            hotelService,
            dbRepositoryUser
          );
          
    
          if (data && data.paymentMethod === "Online") {
            const user = await getUserProfile(userId, dbRepositoryUser);
            
    
            if (typeof data.price === 'number') {
              
              
              const sessionId = await makePayment(
                user?.name,
                user?.email,
                data._id.toString(),
                data.price
              );
           
              
              res.status(HttpStatus.OK).json({
                success: true,
                message: "Booking created successfully",
                id: sessionId,
              });
            } else {
              throw new Error('Invalid price for online payment');
            }
          }else if (data && data.paymentMethod === "Wallet") {
         
            const dates = await addUnavilableDates(
              data.rooms,
              data.checkInDate ?? new Date(),
              data.checkOutDate ?? new Date(),
              dbRepositoryHotel,
              hotelService
            )
            res.status(HttpStatus.OK).json({
              success: true,
              message: "Booking created successfully using Wallet",
              booking: data,
            })
          } else {
            
            const dates = await addUnavilableDates(
              data.rooms,
              data.checkInDate ?? new Date(),
              data.checkOutDate ?? new Date(),
              dbRepositoryHotel,
              hotelService
            )
            res.status(HttpStatus.OK).json({
              success: true,
              message: "Booking created successfully ",
              booking: data,
            })
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
        const { id } = req.params
        const { paymentStatus } = req.body
       
        if (paymentStatus === "Paid") {
  
          const bookings = await getBookingByBookingId(id, dbRepositoryBooking)

  
          if (bookings) {
            const dates = await addUnavilableDates(
              bookings.rooms,
              bookings.checkInDate ?? new Date(),
              bookings.checkOutDate ?? new Date(),
              dbRepositoryHotel,
              hotelService
            )
          }
        }
  
        await updateBookingStatus(
          id,
          paymentStatus,
          dbRepositoryBooking,
          dbRepositoryHotel
        )
        res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Booking status updated" })
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
        const OwnerId = req.owner
        const hotels = await getMyHotels(OwnerId, dbRepositoryHotel)
  
        
        const HotelIds: string[] = hotels.map((hotel) => hotel._id.toString());
  
        const bookings=await getBookingsByHotels(HotelIds,dbRepositoryBooking)
        
  
        
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Bookings fetched successfully",
          bookings,
        })
      } catch (error) {
        next(error)
      }
    }




  /**wallet payment */

  const walletPayment = async (
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const userId=req.user;
      
      const transaction=await getTransaction(userId,dbRepositoryUser);
      res
      .status(200)
      .json({ success: true, transaction, message: "transactions" });
      
    } catch (error) {
      console.log(error);
      
      next(error)
    }
  }


  const addUnavilableDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = req.body

    const result = await addUnavilableDates(
      data.rooms,
      data.checkInDate ?? new Date(),
      data.checkOutDate ?? new Date(),
      dbRepositoryHotel,
      hotelService
    )

    res.status(HttpStatus.OK).json({
      success: true,
      message: "dates added successfully",
      result,
    })
  }




 /**update the wallet  */
 const changeWalletAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, price } = req.body;

    
    
    const updateWallet = await changeWallet(
      bookingId,
      price,
      dbRepositoryBooking
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Bookings details fetched successfully",
    });

  } catch (error) {
    next(error)

  }
}


const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user
    const { bookingID } = req.params
  
    const { reason, status } = req.body

    const updateBooking = await cancelBookingAndUpdateWallet(
      userID,
      bookingID,
      status,
      reason,
      dbRepositoryBooking,
      dbRepositoryUser,
      bookingServiceInterface(bookingService())
    )
    if (updateBooking) {
      const dates = await removeUnavilableDates(
        updateBooking.rooms,
        updateBooking.checkInDate ?? new Date(),
        updateBooking.checkOutDate ?? new Date(),
        dbRepositoryHotel,
        hotelService
      )
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updateBooking,
    })
  } catch (error) {
    next(error)
  }
}

const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user
    const { reason, status } = req.body

    const { bookingID } = req.params

    const updateBooking = await updateBookingDetails(
      userID,
      status,
      reason,
      bookingID,
      dbRepositoryBooking,
      dbRepositoryUser
    )
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updateBooking,
    })
  } catch (error) {
    next(error)
  }
}




/**
   * * METHOD :GET
   * * Retrieve  user wallet
   */
const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    
    const getWallet = await getWalletUser(id,dbRepositoryUser);
    res.status(200).json({ success: true, getWallet});
  } catch (error) {
    next(error);
  }
};

/**Method Get fetch transactions */

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const transaction = await WalletTransactions(userId, dbRepositoryUser);
    res.status(200).json({
      success: true,
      transaction,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};




    const getBookingDetails = async (
      req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ID = req.params.id
     
        const  data  = await getBookingByBookingId(
          ID,
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
      getBookingList,
      walletPayment,
      changeWalletAmount,
      cancelBooking,
      getTransactions,
      getWallet,
      addUnavilableDate,
      getOwnerBookings,
      updateBooking
    }
}