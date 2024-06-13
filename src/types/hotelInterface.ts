export interface HotelInterface {
  name: string;
  email: string;
  ownerId: string;
  place: string;
  description: string;
  room: number;
  guests: number;
  // reservationType: string;
  stayType: string;
  price:string;
  address: {
    streetAddress: string;
    landMark: string;
    district: string;
    city: string;
    pincode: string;
    country: string;
  };
  amenities: string[];
  propertyRules: string[];
  isBlocked: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
  unavailbleDates: Date[];
}
