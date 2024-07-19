import mongoose from "mongoose"
import {bookingEntityType} from "../../../entities/booking"
import Booking from "../models/bookingModel"
import wallet from "../models/wallet"
import Transactions  from "../models/transaction";

export default function bookingDbRepository() {
  const createBooking = async (bookingEntity: bookingEntityType) => {
    const newBooking = new Booking({
      firstName: bookingEntity.getfirstName(),
      lastName:bookingEntity.getlastName(),
      phoneNumber: bookingEntity.getPhoneNumber(),
      email: bookingEntity.getEmail(),
      hotelId: bookingEntity.getHotelId(),
      userId: bookingEntity.getUserId(),
      maxAdults: bookingEntity.getMaxAdults(),
        checkInDate: bookingEntity.getCheckInDate(),
        checkOutDate: bookingEntity.getCheckOutDate(),
      totalDays:bookingEntity.getTotalDays(),
      price: bookingEntity.getPrice(),
      rooms: bookingEntity.getRooms(),
      paymentMethod:bookingEntity.getPaymentMethod(),
    })
    console.log("hlooooo");
    

    newBooking.save()

    return newBooking
  }

  const getAllBooking = async () => {
    const bookings = await Booking.find()

    return bookings
  }

  const getBookingBybookingId = async (id: string) => {
    try {
      const booking = await Booking.findOne({ bookingId: id }).populate("userId").populate("hotelId");
      return booking;
    } catch (error) {
      throw new Error("Error fetching booking by booking ID");
    }
  };

  const getBookingByHotels = async (ids: string[]) => {
    try {
      const bookings = await Booking.find({ hotelId: ids })
        .populate("userId")
        .populate("hotelId")
      return bookings
    } catch (error) {
      throw new Error("Error fetching bookings by hotel ID")
    }
  };


  const getBooking = async (id: string) => {
    try {
      const booking = await Booking.findById(id)
        .populate("userId") 
        .populate("hotelId")
        .populate("hotelId.ownerId") 

      return booking
    } catch (error) {
      console.error("Error fetching booking by ID:", error)
      throw new Error("Error fetching booking by ID")
    }
  }
  

  const deleteBooking = async (id: string) =>
    await Booking.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    )

    const updateBooking = async (
      bookingId: string,
      updatingData: Record<any, any>
    ) => {
      try {
        const updatedBooking = await Booking.findOneAndUpdate(
          { bookingId },
          updatingData,
          { new: true, upsert: true }
        )    .populate({
          path: "hotelId",
          populate: {
            path: "ownerId"
          }
        });
        return updatedBooking
      } catch (error) {
        throw new Error("Error updating booking")
      }
    }

    const changeBookingstatusPayment = async (id: string) => {
      return await Booking.findByIdAndUpdate(id, { paymentStatus: "Paid" });
    };

  const updateBookings = async (
    bookingId: string,
    updatingData: Record<any, any>
) => {
    return await Booking.findOneAndUpdate({ bookingId }, {paymentStatus:"Paid"});
};


const getWalletBalance = async(userId:any)=>{
  const walletData = await wallet.findOne({userId:userId});

  const balanceAmount = walletData?.balance;
  return balanceAmount;
}

const  amountDebit = async(userId:any,Amount:any)=>{
  const WalletId = await wallet.findOne({userId:userId});

  const walletTransaction = await Transactions.create({
    walletId:WalletId,
    userId:userId,
    amount:Amount,
    type:"Debit",
    Description:"Wallet Payment"
  });
}

const changeTheWallet = async(fees:any,UserId:any)=>{
  const walletData = await wallet.findOne({userId:UserId});

  if(!walletData){
    throw new Error("Wallet not found");
  }

  const newBalance = walletData.balance-fees;
  //@ts-ignore
  walletData?.balance= newBalance;
  await walletData.save()
}


const changeBookingStatus = async (BookingStatus: string,cancelReason:string, id: string) => {
  try {

   const res = await Booking.findByIdAndUpdate(id, { status: BookingStatus,  cancelReason: cancelReason});
 
   return res
  } catch (error) {
    console.error('Error updating booking status:', error);
  }
};

const getBookingById = async (bookingId: string) =>
  await Booking.findById({ _id:bookingId });


const amountCredit = async(fee:any,UserId:any)=>{
  const WalletId = await wallet.findOne({userId:UserId});

  const walletTransaction = await Transactions.create({
    walletId:WalletId,
    userId:UserId,
    amount:fee,
    type:"Credit",
    Description:"Refund Amound"
  });

}



const getAllBookingByUserId = async (userId: string) =>{
  try {
    const bookings = await Booking.find({ userId: userId }).populate("userId").populate("hotelId").sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error("Error fetching bookings by user ID");
  }
}
  

const getAllBookingByHotelId = async (hotelId: string) =>
  await Booking.find({ hotelId:hotelId });

    return {
        createBooking,
        getAllBooking,
        getBooking,
        deleteBooking,
        updateBooking,
        changeBookingstatusPayment,
        updateBookings,
        getAllBookingByUserId,
        getAllBookingByHotelId,
        getWalletBalance,
        amountCredit,
        amountDebit,
        getBookingById,
         changeTheWallet,
         changeBookingStatus,
         getBookingBybookingId,
         getBookingByHotels
      };
}
export type bookingDbRepositoryType = typeof bookingDbRepository