"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ratingEntity;
function ratingEntity(userId, hotelId, rating, description, imageUrls) {
    return {
        getUserId: () => userId,
        getHotelId: () => hotelId,
        getRating: () => rating,
        getDescription: () => description,
        getImageUrls: () => imageUrls,
    };
}
