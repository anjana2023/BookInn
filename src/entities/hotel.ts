export default function hotelEntity(
  name: string,
  email: string,
  ownerId: string,
  place: string,
  description: string,
  propertyRules: string[],
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
  imageUrls: string[],
  hotelDocument:string
) {
  return {
    getName: (): string => name,
    getEmail: (): string => email,
    getOwnerId: (): string => ownerId,
    getPlace: (): string => place,
    getDescription: (): string => description,
    getPropertyRules: (): string[] => propertyRules,
    getStayType: (): string => stayType,
    getAddress: () => address,
    getAmenities: (): string[] => amenities,
    getImageUrls: (): string[] => imageUrls,
    getHotelDocument:():string=>hotelDocument,
  };
}

export type HotelEntityType = ReturnType<typeof hotelEntity>;
