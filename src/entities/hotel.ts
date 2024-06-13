export default function hotelEntity(
  name: string,
  email: string,
  ownerId: string,
  place: string,
  price: string,
  description: string,
  room: number,
  guests: number,
  propertyRules: string[],
  // reservationType: string,
  stayType: string,
  address: {
    streetAddress: string;
    landMark: string;
    district: string;
    city: string;
    pincode: string;
    country: string;
  },
  amenities: string[],
  imageUrls: string[]
) {
  return {
    getName: (): string => name,
    getEmail: (): string => email,
    getOwnerId: (): string => ownerId,
    getPlace: (): string => place,
    getDescription: (): string => description,
    getPropertyRules: (): string[] => propertyRules,
   
    getRoom: (): number => room,
    getGuests: (): number => guests,
    getPrice:():string=>price,
    // getReservationType: (): string => reservationType,
    getStayType: (): string => stayType,
    getAddress: () => address,
    getAmenities: (): string[] => amenities,
    getImageUrls: (): string[] => imageUrls,
  };
}

export type HotelEntityType = ReturnType<typeof hotelEntity>;
