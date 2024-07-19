import mongoose from "mongoose";

export interface RoomInterface {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  title: string
  price: number
  maxAdults: number
  maxChildren: number
  desc: string
  roomNumbers: { number: number; unavailableDates: Date[] }[]
}

export interface HotelInterface {
  name: string;
  email: string;
  ownerId: string;
  place: string;
  description: string;
  rooms: RoomInterface[];
  stayType: string;
  address: {
    streetAddress: string;
    landMark: string;
    district: string;
    city: string;
    pincode: string;
    country: string;
  };
  location?: {
    type: string;
    coordinates: [number, number];
  };
  amenities: string[];
  propertyRules: string[];
  isBlocked: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
  hotelDocument: string;
  unavailbleDates: Date[];
}

export interface Options {
  adult: number;
  children: number;
  room: number;
}
export interface Dates {
  startDate: string;
  endDate: string;
  
};

export interface optionType {
  adult: number
  children: number
  room: number
}