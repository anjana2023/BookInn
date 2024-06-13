import mongoose from "mongoose"
import {bookingEntityType} from "../../../entities/booking"
import Booking from "../models/bookingModel"

export default function bookingDbRepository() {
  const createBooking = async (bookingEntity: bookingEntityType) => {
    const newBooking = new Booking({
      firstName: bookingEntity.getfirstName(),
      lastName:bookingEntity.getlastName(),
      phoneNumber: bookingEntity.getPhoneNumber(),
      email: bookingEntity.getEmail(),
      hotelId: bookingEntity.getHotelId(),
      userId: bookingEntity.getUserId(),
      maxPeople: bookingEntity.getMaxPeople(),
      checkInDate: bookingEntity.checkInDate(),
      checkOutDate: bookingEntity.checkOutDate(),
      totalDays:bookingEntity.getTotalDays(),
      price: bookingEntity.getPrice(),
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

  const getBooking = async (id: string) => await Booking.findById(id)

  const deleteBooking = async (id: string) =>
    await Booking.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    )

  const updateBooking = async (id: string, updates: any) =>
    await Booking.updateOne(
      { _id: id },
      {
        $set: updates,
      }
    )

    const changeBookingstatusPayment = async (id: string) => {
      return await Booking.findByIdAndUpdate(id, { paymentStatus: "Success" });
    };

  const updateBookings = async (
    bookingId: string,
    updatingData: Record<any, any>
) => {
    return await Booking.findOneAndUpdate({ bookingId }, {paymentStatus:"Paid"});
};


const getAllBookingByUserId = async (userId: string) =>
  await Booking.find({ userId:userId });

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
        getAllBookingByHotelId
      };
}
export type bookingDbRepositoryType = typeof bookingDbRepository