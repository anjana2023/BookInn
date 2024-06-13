import { HotelInterface } from './../../../types/hotelInterface';
import { HotelEntityType } from "../../../entities/hotel"
import Hotel from "../models/hotelModel"
import Booking from '../models/bookingModel';

export const hotelDbRepository=()=>{
    const addHotel=async(hotel:HotelEntityType)=>{
        const newHotel:any=new Hotel({
         name:hotel.getName(),
            email:hotel.getEmail(),
            place:hotel.getPlace(),
            address: hotel.getAddress(),
            ownerId:hotel.getOwnerId(),
            description:hotel.getDescription(),
            room: hotel.getRoom(),
            price: hotel.getPrice(),
            guests: hotel.getGuests(),
            propertyRules:hotel.getPropertyRules(),
           
            // reservationType: hotel.getReservationType(),
            stayType: hotel.getStayType(),
            amenities:hotel.getAmenities(),
            imageUrls: hotel.getImageUrls(),
        })
       await newHotel.save();
        return newHotel
    }
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
        console.log(Hotels)
      console.log(Hotels,"..........hjfeasfufbaekhubv")
        return Hotels;
      };
    
      const getHotelDetails=async(id:string)=>{
        const Hotels = await Hotel.findById(id);
        return Hotels;
      }

const getHotel=async(id:string,status:string)=>await Hotel.findByIdAndUpdate(id,{status:status,isApproved:true}).select("-password -isApproved ")


const getRejectedHotelById = async (id: string) =>
  await Hotel.findByIdAndUpdate(id,{status:"pending"}).select(
    "-password -isVerified -isApproved"
); 

const getHotelById = async (id: string) =>
  await Hotel.findById(id).select(
    "-password -isVerified -isApproved -isRejected -verificationToken "
  );


  const updateHotelBlock = async (id: string, status: boolean) =>
    await Hotel.findByIdAndUpdate(id, { isBlocked: status });


  const updateHotelInfo = async (id: string, updateData:Record<string,any>)=> await Hotel.findByIdAndUpdate(id,updateData,{new:true})


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
  
    if (!hotel) {
      throw new Error("Hotel not found");
    }
  
    if (!Array.isArray(hotel.unavailableDates)) {
      throw new Error("Unavailable dates is not an array");
    }
  
    const datesInRange = getDatesInRange(checkIn, checkOut);
    console.log(datesInRange, "....................");
  
    const isUnavailable = datesInRange.some(date =>
      hotel.unavailableDates.some(unavailableDate => {
        if (unavailableDate instanceof Date) {
          return unavailableDate.getTime() === date.getTime();
        }
        return false;
      })
    );
  
    console.log("////////////////////////", isUnavailable);
  
    return !isUnavailable;
  };
  
  const getAllBookings = async () => await Booking.find({ status: "Booked" }); 
  


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
        updateHotelInfo,
        updateHotelBlock,
        updateUnavailableDates,
        checkAvailability,
        getAllBookings
        // getHotelbyId
    }
}
export type hotelDbRepositoryType=typeof hotelDbRepository;