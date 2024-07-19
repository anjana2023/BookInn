import mongoose, { mongo } from "mongoose";
import { bookingEntityType } from "../../entities/booking";
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB";

export default function bookingDbInterface(
  repository: ReturnType<bookingDbRepositoryType>
) {
  const createBooking = async (bookingEntity: bookingEntityType) =>
    await repository.createBooking(bookingEntity);

  const getAllBooking = async () => await repository.getAllBooking();

  const getAllBookingByUserId = async (userId: string) =>
    await repository.getAllBookingByUserId(userId);

  const getAllBookingByHotelId = async (doctorId: string) =>
    await repository.getAllBookingByHotelId(doctorId);

  const changeBookingstatus = async (BookingStatus:string,cancelReason:string,id:string)=>
    await repository.changeBookingStatus(BookingStatus,cancelReason,id);

  const getBookingByHotels = async (bookingId: string[]) =>
    await repository.getBookingByHotels(bookingId)


  const getBooking = async (bookingId: string) =>
    await repository.getBooking(bookingId);

  const deleteBooking = async (bookingId: string) =>
    await repository.deleteBooking(bookingId);

  const updateBooking = async (bookingId: string, updates: any) =>
    await repository.updateBooking(bookingId, updates);

  const changeBookingstatusPayment = async(id:string)=>
    await repository.changeBookingstatusPayment(id)

  const updateBookingDetails = async (
    bookingId: string,
    updatingData: Record<any, any>
  ) => await repository.updateBookings(bookingId, updatingData);


  const getBalanceAmount = async(userId:any)=>{
    const balance = await repository.getWalletBalance(userId);
    return balance
  }
  const changeTheWalletAmount = async(fees:any,UserId:any)=>{
    await repository.changeTheWallet(fees,UserId);
  }

  const debitAmount = async(userId:any,Amount:any)=>{
    const amount  = await repository.amountDebit(userId,Amount);
  }

  const creditAmount = async(price:any,UserId:any)=>{
    const amount = await repository.amountCredit(price,UserId);
  }

  const getBookingById = async (bookingId: string) =>
    await repository.getBookingById(bookingId);

  return {
    createBooking,
    getAllBooking,
    getBooking,
    deleteBooking,
    updateBooking,
    changeBookingstatusPayment,
    updateBookingDetails,
    getAllBookingByUserId,
    getAllBookingByHotelId,
    getBalanceAmount,
    debitAmount,
    creditAmount,
    getBookingById,
    changeTheWalletAmount,
    changeBookingstatus,
    getBookingByHotels
  };
}

export type bookingDbInterfaceType = typeof bookingDbInterface;