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




  return {
    createBooking,
    getAllBooking,
    getBooking,
    deleteBooking,
    updateBooking,
    changeBookingstatusPayment,
    updateBookingDetails,
    getAllBookingByUserId,
    getAllBookingByHotelId
  };
}

export type bookingDbInterfaceType = typeof bookingDbInterface;