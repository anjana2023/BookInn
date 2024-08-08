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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelDbRepository = void 0;
const hotelModel_1 = __importDefault(require("../models/hotelModel"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const roomModel_1 = __importDefault(require("../models/roomModel"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const ratingModel_1 = __importDefault(require("../models/ratingModel"));
const hotelDbRepository = () => {
    const addHotel = (hotel) => __awaiter(void 0, void 0, void 0, function* () {
        const newHotel = new hotelModel_1.default({
            name: hotel.getName(),
            email: hotel.getEmail(),
            place: hotel.getPlace(),
            address: hotel.getAddress(),
            ownerId: hotel.getOwnerId(),
            description: hotel.getDescription(),
            propertyRules: hotel.getPropertyRules(),
            stayType: hotel.getStayType(),
            amenities: hotel.getAmenities(),
            imageUrls: hotel.getImageUrls(),
            hotelDocument: hotel.getHotelDocument(),
        });
        yield newHotel.save();
        return newHotel;
    });
    const addRoom = (room, hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        const newRoom = new roomModel_1.default({
            title: room.getTitle(),
            price: room.getPrice(),
            maxChildren: room.getMaxChildren(),
            maxAdults: room.getMaxAdults(),
            desc: room.getDescription(),
            roomNumbers: room.getRoomNumbers(),
        });
        try {
            const savedRoom = yield newRoom.save();
            try {
                yield hotelModel_1.default.findByIdAndUpdate(hotelId, {
                    $push: { rooms: savedRoom._id },
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log(error);
        }
        return newRoom;
    });
    const addStayType = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const newCategory = new categoryModel_1.default({
            title: name,
        });
        newCategory.save();
        return newCategory;
    });
    const deleteRoom = (roomId, hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield roomModel_1.default.findByIdAndDelete(roomId);
            try {
                yield hotelModel_1.default.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } });
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const addUnavilableDates = (rooms, dates) => __awaiter(void 0, void 0, void 0, function* () {
        for (const room of rooms) {
            const roomId = room.roomId;
            const roomNumbers = room.roomNumbers;
            for (const roomNumber of roomNumbers) {
                yield roomModel_1.default.updateOne({ _id: roomId, "roomNumbers.number": roomNumber }, { $addToSet: { "roomNumbers.$.unavailableDates": { $each: dates } } });
            }
        }
        return;
    });
    const removeUnavailableDates = (rooms, dates) => __awaiter(void 0, void 0, void 0, function* () {
        for (const room of rooms) {
            const roomId = room.roomId;
            const roomNumbers = room.roomNumbers;
            for (const roomNumber of roomNumbers) {
                yield roomModel_1.default.updateOne({ _id: roomId, "roomNumbers.number": roomNumber }, { $pull: { "roomNumbers.$.unavailableDates": { $in: dates } } });
            }
        }
        return;
    });
    const getHotelByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const hotel = yield hotelModel_1.default.findOne({ name });
        return hotel;
    });
    const getHotelEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield hotelModel_1.default.findOne({ email });
        return user;
    });
    const getAllHotels = () => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.find({});
        return Hotels;
    });
    const getUserHotels = () => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.find({});
        return Hotels;
    });
    const getMyHotels = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.find({ ownerId });
        return Hotels;
    });
    const getHotelDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.findById(id).populate("rooms").populate("ownerId");
        return Hotels;
    });
    const getHotel = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelModel_1.default.findByIdAndUpdate(id, { status: status, isApproved: true }).select("-password -isApproved "); });
    const getRejectedHotelById = (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield hotelModel_1.default.findByIdAndUpdate(id, { status: "pending" }).select("-password -isVerified -isApproved -isRejected");
    });
    const getHotelById = (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield hotelModel_1.default.findById(id).select("-password -isVerified -isApproved -isRejected -verificationToken ");
    });
    const updateHotelBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelModel_1.default.findByIdAndUpdate(id, { isBlocked: status }); });
    const update = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedHotel = yield hotelModel_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        return updatedHotel;
    });
    const getHotelByIdUpdateRejected = (id, status, reason) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelModel_1.default.findByIdAndUpdate(id, { status: status, isApproved: false, rejectedReason: reason }).select("-password -isVerified -isApproved "); });
    const updateUnavailableDates = (id, dates) => __awaiter(void 0, void 0, void 0, function* () {
        return yield hotelModel_1.default.updateOne({ _id: id }, { $addToSet: { unavailableDates: { $each: dates } } });
    });
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };
    const checkAvailability = (id, checkInDate, checkOutDate) => __awaiter(void 0, void 0, void 0, function* () {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const hotel = yield hotelModel_1.default.findById(id).select("unavailableDates");
    });
    const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () { return yield bookingModel_1.default.find({ status: "Booked" }); });
    const splitDate = (dateString) => {
        const [date, time] = dateString.split("T");
        const timeWithoutZ = time.replace("Z", ""); // Remove 'Z' from time
        return { date, time: timeWithoutZ };
    };
    const getDates = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        const datesArray = [];
        while (currentDate <= end) {
            const formattedDate = new Date(currentDate);
            formattedDate.setUTCHours(0, 0, 0, 0);
            datesArray.push(formattedDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return datesArray;
    });
    const filterHotels = (place, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
        let hotels;
        try {
            // Fetch hotels based on place
            if (place) {
                const regex = new RegExp(place, "i");
                hotels = yield hotelModel_1.default.find({
                    $or: [{ place: { $regex: regex } }, { name: { $regex: regex } }],
                    isApproved: true,
                    isBlocked: false,
                }).populate("rooms");
            }
            else {
                hotels = yield hotelModel_1.default.find({
                    isApproved: true,
                    isBlocked: false,
                }).populate("rooms");
            }
            // Filter by room capacity
            const adultsInt = adults ? parseInt(adults) : 0;
            const childrenInt = children ? parseInt(children) : 0;
            hotels = hotels.filter((hotel) => {
                const filteredRooms = hotel.rooms.filter((room) => {
                    return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt;
                });
                if (filteredRooms.length > 0) {
                    hotel.rooms = filteredRooms;
                    return true;
                }
                return false;
            });
            // Filter by availability and dates
            const start = splitDate(startDate);
            const end = splitDate(endDate);
            const dates = yield getDates(start.date, end.date);
            const isRoomNumberAvailable = (roomNumber) => {
                return !roomNumber.unavailableDates.some((date) => {
                    const curr = new Date(date).toISOString().split("T")[0];
                    return dates.includes(curr);
                });
            };
            // Filter by price range
            if (minPrice && maxPrice && parseInt(maxPrice) !== 0) {
                const minPriceInt = parseInt(minPrice, 10);
                const maxPriceInt = parseInt(maxPrice, 10);
                hotels = hotels.filter((hotel) => {
                    const filteredRooms = hotel.rooms.filter((room) => {
                        return room.price !== undefined &&
                            room.price >= minPriceInt &&
                            room.price <= maxPriceInt;
                    });
                    if (filteredRooms.length > 0) {
                        hotel.rooms = filteredRooms;
                        return true;
                    }
                    return false;
                });
            }
            // Filter by amenities
            if (amenities) {
                const amenitiesArr = amenities.split(",");
                hotels = hotels.filter(hotel => {
                    return amenitiesArr.every(amenity => hotel.amenities.includes(amenity));
                });
            }
            // Pagination
            const paginatedHotels = hotels.slice(skip, skip + limit);
            return paginatedHotels;
        }
        catch (error) {
            console.error("Error filtering hotels:", error);
            throw new Error("Failed to filter hotels");
        }
    });
    const UserfilterHotelBYId = (id, adults, children, room, startDate, endDate, minPrice, maxPrice) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hotel = yield hotelModel_1.default.findById(id).populate("rooms");
            if (!hotel) {
                throw new Error("Hotel not found");
            }
            const adultsInt = adults ? parseInt(adults) : 0;
            const childrenInt = children ? parseInt(children) : 0;
            hotel.rooms = hotel.rooms.filter((room) => {
                return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt;
            });
            const start = splitDate(startDate);
            const end = splitDate(endDate);
            // Get dates between start and end date
            const dates = yield getDates(start.date, end.date);
            // Function to check room availability
            const isRoomNumberAvailable = (roomNumber) => {
                return !roomNumber.unavailableDates.some((date) => {
                    const curr = new Date(date).toISOString().split("T")[0];
                    return dates.includes(curr);
                });
            };
            // Filter rooms again based on availability
            hotel.rooms.forEach((room) => {
                room.roomNumbers = room.roomNumbers.filter(isRoomNumberAvailable);
            });
            // Filter out rooms that have no available room numbers
            hotel.rooms = hotel.rooms.filter((room) => room.roomNumbers.length > 0);
            return hotel;
        }
        catch (error) {
            console.error("Error filtering hotel:", error);
            throw error;
        }
    });
    const addRating = (ratingData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = new ratingModel_1.default({
            userId: ratingData.getUserId(),
            hotelId: ratingData.getHotelId(),
            rating: ratingData.getRating(),
            description: ratingData.getDescription(),
            imageUrls: ratingData.getImageUrls(),
        });
        const savedRating = yield result.save();
        try {
            yield hotelModel_1.default.findByIdAndUpdate(savedRating.hotelId, {
                $push: { rating: savedRating._id },
            });
        }
        catch (error) {
        }
        return savedRating;
    });
    const getRatings = (filter) => __awaiter(void 0, void 0, void 0, function* () { return yield ratingModel_1.default.find(filter).populate("userId"); });
    const getRatingById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield ratingModel_1.default.findById(id).populate("userId"); });
    const updateRatingById = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield ratingModel_1.default.findByIdAndUpdate(id, updates, { new: true });
            return result;
        }
        catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    });
    return {
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
        update,
        updateHotelBlock,
        updateUnavailableDates,
        checkAvailability,
        getAllBookings,
        addRoom,
        addStayType,
        UserfilterHotelBYId,
        addUnavilableDates,
        deleteRoom,
        removeUnavailableDates,
        filterHotels,
        getRatingById,
        getRatings,
        addRating,
        updateRatingById
    };
};
exports.hotelDbRepository = hotelDbRepository;
