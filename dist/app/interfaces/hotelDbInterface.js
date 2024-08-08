"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelDbInterface = void 0;
const hotelDbInterface = (repository) => {
    const addHotel = (hotel) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addHotel(hotel); });
    const addRoom = (hotel, hotelId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addRoom(hotel, hotelId); });
    const addStayType = (name) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addStayType(name); });
    const getHotelByName = (name) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelByName(name); });
    const getHotelByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelEmail(email); });
    const getAllHotels = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllHotels(); });
    const getUserHotels = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserHotels(); });
    const getMyHotels = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield repository.getMyHotels(ownerId);
        return res;
    });
    const getHotelDetails = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelDetails(id); });
    const updateHotel = (id, updates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.update(id, updates); });
    const addUnavilableDates = (room, dates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addUnavilableDates(room, dates); });
    const removeUnavailableDates = (room, dates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.removeUnavailableDates(room, dates); });
    const getHotel = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotel(id, status); });
    const getRejectedHotelById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getRejectedHotelById(id); });
    const getHotelByIdUpdateRejected = (id, status, reason) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelByIdUpdateRejected(id, status, reason); });
    const getHotelById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelById(id); });
    const updateHotelBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateHotelBlock(id, status); });
    const updateUnavailableDates = (id, dates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUnavailableDates(id, dates); });
    const checkAvailability = (id, checkInDate, checkOutDate) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.checkAvailability(id, checkInDate, checkOutDate); });
    const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllBookings(); });
    const filterHotels = (place, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield repository.filterHotels(place, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit);
        return data;
    });
    const UserfilterHotelBYId = (id, adults, children, room, startDate, endDate, minPrice, maxPrice) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.UserfilterHotelBYId(id, adults, children, room, startDate, endDate, minPrice, maxPrice);
    });
    const addRating = (ratingData) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addRating(ratingData); });
    const getRatings = (filter) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getRatings(filter); });
    const getRatingById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getRatingById(id); });
    const updateRatings = (id, updates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateRatingById(id, updates); });
    return {
        addHotel,
        getHotelByName,
        getHotelByEmail,
        getAllHotels,
        getUserHotels,
        getMyHotels,
        getHotelDetails,
        getHotel,
        getRejectedHotelById,
        getHotelByIdUpdateRejected,
        getHotelById,
        updateHotel,
        updateHotelBlock,
        updateUnavailableDates,
        checkAvailability,
        getAllBookings,
        addRoom,
        addStayType,
        addUnavilableDates,
        removeUnavailableDates,
        filterHotels,
        UserfilterHotelBYId,
        addRating,
        getRatings,
        getRatingById,
        updateRatings
    };
};
exports.hotelDbInterface = hotelDbInterface;
