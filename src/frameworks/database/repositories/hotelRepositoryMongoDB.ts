import { HotelInterface } from './../../../types/hotelInterface';
import { HotelEntityType } from "../../../entities/hotel"
import Hotel from "../models/hotelModel"

export const hotelDbRepository=()=>{
    const addHotel=async(hotel:HotelEntityType)=>{
        const newHotel:any=new Hotel({
         name:hotel.getName(),
            email:hotel.getEmail(),
            place:hotel.getPlace(),
            ownerId:hotel.getOwnerId(),
            description:hotel.getDescription(),
            propertyRules:hotel.getPropertyRules(),
            aboutProperty:hotel.getAboutProperty(),
            rooms:hotel.getRooms(),
            amenities:hotel.getAmenities(),
            image: hotel.getImage(),
        })
        newHotel.save();
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
      console.log(Hotels,"...........reposhotel")
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

  const getHotelbyId = async (id: string) => {
    const hotel: HotelInterface | null = await Hotel.findById(id);
    return hotel;
  };



  const updateHotelBlock = async (id: string, status: boolean) =>
    await Hotel.findByIdAndUpdate(id, { isBlocked: status });


  const updateHotelInfo = async (id: string, updateData:Record<string,any>)=> await Hotel.findByIdAndUpdate(id,updateData,{new:true})


const getHotelByIdUpdateRejected = async (id: string,status:string,reason:string) =>await Hotel.findByIdAndUpdate(id,{status:status, isApproved:false, rejectedReason:reason}).select("-password -isVerified -isApproved ");

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
        getHotelbyId
    }
}
export type hotelDbRepositoryType=typeof hotelDbRepository;