"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hotelEntity;
function hotelEntity(name, email, ownerId, place, description, propertyRules, stayType, address, amenities, imageUrls, hotelDocument) {
    return {
        getName: () => name,
        getEmail: () => email,
        getOwnerId: () => ownerId,
        getPlace: () => place,
        getDescription: () => description,
        getPropertyRules: () => propertyRules,
        getStayType: () => stayType,
        getAddress: () => address,
        getAmenities: () => amenities,
        getImageUrls: () => imageUrls,
        getHotelDocument: () => hotelDocument,
    };
}
