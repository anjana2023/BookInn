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
const hotel_1 = require("../../app/usecases/owner/hotel");
const httpStatus_1 = require("../../types/httpStatus");
const hotel_2 = require("../../app/usecases/User/read&write/hotel");
const booking_1 = require("../../app/usecases/Booking/booking");
const mongoose_1 = __importDefault(require("mongoose"));
const hotelController = (hotelDbRepository, hotelDbRepositoryImpl, bookingDbRepository, bookingDbRepositoryImp) => {
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp());
    const registerHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ownerId = req.owner;
            const hotelData = req.body;
            const registeredHotel = yield (0, hotel_1.addHotel)(ownerId, hotelData, dbRepositoryHotel);
            res.json({
                status: "success",
                message: "Hotel added successfully",
                registeredHotel,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const registerRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hotelId = new mongoose_1.default.Types.ObjectId(req.params.id);
            const roomData = req.body;
            const registeredRoom = yield (0, hotel_1.addRoom)(hotelId, roomData, dbRepositoryHotel);
            res.json({
                status: "success",
                message: "room added suuccessfully",
                registeredRoom,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const registeredHotels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ownerId = req.owner;
            const Hotels = yield (0, hotel_1.getMyHotels)(ownerId, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotels });
        }
        catch (error) {
            next(error);
        }
    });
    const getHotelsUserSide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // if (req.user) {
            const Hotels = yield (0, hotel_2.getUserHotels)(dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotels });
            // }
        }
        catch (error) {
            next(error);
        }
    });
    const destinationSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const place = req.query.destination;
            const adults = req.query.adult;
            const children = req.query.children;
            const room = req.query.room;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const amenities = req.query.amenities;
            const minPrice = req.body.minPrice;
            const maxPrice = req.body.maxPrice;
            const stayTypes = req.query.stayTypes;
            const page = parseInt(req.query.pages) || 1;
            const limit = 2;
            const skip = (page - 1) * limit;
            const data = yield (0, hotel_2.filterHotels)(place, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, stayTypes, dbRepositoryHotel, skip, limit);
            res.status(httpStatus_1.HttpStatus.OK).json({
                status: "success",
                message: "search result has been fetched",
                data: data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const DetailsFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const adults = req.query.adult;
            const children = req.query.children;
            const room = req.query.room;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const minPrice = req.body.minPrice;
            const maxPrice = req.body.maxPrice;
            const data = yield (0, hotel_2.hotelDetailsFilter)(id, adults, children, room, startDate, endDate, minPrice, maxPrice, dbRepositoryHotel);
            res.status(httpStatus_1.HttpStatus.OK).json({
                status: "success",
                message: "Hotel details fetched",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const hotelDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const Hotel = yield (0, hotel_2.getHotelDetails)(id, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotel });
        }
        catch (error) {
            next(error);
        }
    });
    const updateHotelInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const result = yield (0, hotel_1.updateHotel)(id, req.body, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: "  Successfully updated" });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const hotelBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedHotel = yield (0, hotel_1.blockHotel)(id, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Hotel block status updated successfully",
                hotel: updatedHotel
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getHotelRejected = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const doctor = yield (0, hotel_1.HotelRejected)(id, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, doctor });
        }
        catch (error) {
            next(error);
        }
    });
    const checkAvilabitiy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dates = req.body;
            const id = req.params.id;
            const isDateExisted = yield (0, booking_1.checkAvailability)(id, dates, dbRepositoryHotel);
        }
        catch (error) {
            next(error);
        }
    });
    const getOwnerBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userID = req.owner;
            const hotels = yield (0, hotel_1.getMyHotels)(userID, dbRepositoryHotel);
            const HotelIds = hotels.map((hotel) => hotel._id.toString());
            const bookings = yield (0, booking_1.getBookingsByHotels)(HotelIds, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const addRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user;
        const data = req.body;
        const result = yield (0, hotel_2.addNewRating)(userId, data, dbRepositoryHotel);
        if (result) {
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "  Successfully added rating" });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getRatingsbyHotelId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const hotelId = req.params.hotelId;
        const result = yield (0, hotel_2.ratings)(hotelId, dbRepositoryHotel);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted rating",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getRatingsbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const Id = req.params.Id;
        const result = yield (0, hotel_2.ReviewById)(Id, dbRepositoryHotel);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted rating",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const updateRatingsbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const Id = req.params.Id;
        const updates = req.body;
        const result = yield (0, hotel_2.updateReviewById)(Id, updates, dbRepositoryHotel);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted rating",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    return {
        registerHotel,
        registerRoom,
        registeredHotels,
        getHotelsUserSide,
        hotelDetails,
        updateHotelInfo,
        hotelBlock,
        getOwnerBookings,
        checkAvilabitiy,
        getHotelRejected,
        destinationSearch,
        DetailsFilter,
        updateRatingsbyId,
        getRatingsbyId,
        getRatingsbyHotelId,
        addRating
    };
};
exports.default = hotelController;
