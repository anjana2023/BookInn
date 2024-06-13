import mongoose from "mongoose"
import Stripe from "stripe";
import createBookingEntity from "../../../entities/booking"
import { BookingInterface, dateInterface } from "../../../types/bookingInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { bookingDbInterfaceType } from "../../interfaces/bookingDbInterface"
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface"
import { HotelServiceInterface } from "../../service-interface/hotelServices"
import configKeys from "../../../config"


export default async function createBooking(
    userId:string,
    bookingDetails: BookingInterface,
    bookingRepository: ReturnType<bookingDbInterfaceType>,
    hotelRepository: ReturnType<hotelDbInterfaceType>,
    hotelSerice: ReturnType<HotelServiceInterface>
  ) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      hotelId,
      maxPeople,
      checkInDate,
      checkOutDate,
      totalDays,
      price,
      paymentMethod
    } = bookingDetails
    console.log(bookingDetails)
  
    const dates = await hotelSerice.unavailbleDates(checkInDate, checkOutDate)
    console.log(dates)
  
    if (
      !firstName ||
      !lastName||
      !phoneNumber ||
      !email ||
      !hotelId ||
      !userId ||
      !maxPeople ||
      !checkInDate ||
      !checkOutDate ||
      !price||
      !totalDays||
      !paymentMethod
    ) {
      throw new AppError("Missing fields in Booking", HttpStatus.BAD_REQUEST)
    }
    //creating booking entities
  
    const bookingEntity = createBookingEntity(
      firstName,
      lastName,
      phoneNumber,
      email,
      new mongoose.Types.ObjectId(hotelId),
      new mongoose.Types.ObjectId(userId),
      maxPeople,
      checkInDate,
      checkOutDate,
      totalDays,
      price,
      paymentMethod
    )
  
    const data = await bookingRepository.createBooking(bookingEntity)
  
    await hotelRepository.updateUnavailableDates(hotelId, dates)
  
    return data
  }
  
  
  export const checkAvailability = async (
    id:string,
    dates:dateInterface,
    hotelRepository: ReturnType<hotelDbInterfaceType>,
  ) =>await hotelRepository.checkAvailability(id,dates.checkInDate,dates.checkOutDate)
  
  
  export const makePayment = async (
    userName: string = "John Doe",
    email: string = "johndoe@gmail.com",
    bookingId: string,
    totalAmount: number
  ) => {
   
    console.log('nsjbzdhvcxhbjnkm')
    console.log(bookingId,"....bokingId.........")
    const stripe = new Stripe(configKeys.STRIPE_SECRET_KEY);
  
    const customer = await stripe.customers.create({
      name: userName,
      email: email,
      address: {
        line1: "Los Angeles, LA",
        country: "US",
      },
    });
    console.log(customer,"customer");
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Guests", description: "Room booking" },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${configKeys.CLIENT_PORT}/payment_status/${bookingId}?success=true`,
      cancel_url: `${configKeys.CLIENT_PORT}/payment_status/${bookingId}?success=false`,
    });
  
    console.log(session.id,"////////////////////////////////////////////////");
    
    return session.id;
  };

  export const updateBookingStatusPayment = async(
    id:string,
    bookingRepository:ReturnType<bookingDbInterfaceType>
  )=>{
    const status = await bookingRepository.changeBookingstatusPayment(id);
    return status;
  }

  export const updateBookingStatus = async (
    id: string,
    paymentStatus: "Paid" | "Failed",
    bookingRepository: ReturnType<bookingDbInterfaceType>,
  ) => {
    const bookingStatus = paymentStatus === "Paid" ? "Confirmed" : "Pending";
    const updationData: Record<string, any> = {
      paymentStatus,
      bookingStatus,
    };
  
    const bookingData = await bookingRepository.updateBookingDetails(
      id,
      updationData
    );

    return bookingData;
  };

  export const getBookingByBookingId = async (
    bookingID: string,
    bookingRepository: ReturnType<bookingDbInterfaceType>
  ) => {
    const bookingDetails = await bookingRepository.getBooking(bookingID);
    return { bookingDetails };
  };

  export const getBookingByUserId = async (
    userId: string,
    bookingRepository: ReturnType<bookingDbInterfaceType>
  ) => {
    const bookingDetails = await bookingRepository.getAllBookingByUserId(userId);
    console.log(bookingDetails,"bookingdetausss")
    return { bookingDetails };
  };

  
  export const getBookingByHotelId = async (
    doctorId: string,
    bookingRepository: ReturnType<bookingDbInterfaceType>
  ) => {
    const bookingDetails = await bookingRepository.getAllBookingByHotelId(doctorId);
    return { bookingDetails };
  };
