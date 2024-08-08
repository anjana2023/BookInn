"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.default = bookingController;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const httpStatus_1 = require("../types/httpStatus");
const profile_1 = require("../app/usecases/User/read&write/profile");
const booking_1 = __importStar(require("../app/usecases/Booking/booking"));
const hotel_1 = require("../app/usecases/owner/hotel");
const bookingService_1 = require("../frameworks/servies/bookingService");
const bookingService_2 = require("../app/service-interface/bookingService");
function bookingController(bookingDbRepository, bookingDbRepositoryImp, hotelDbRepository, hotelDbRepositoryImpl, hotelServiceInterface, hotelServiceImpl, userDbRepository, userDbRepositoryImpl) {
    const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp());
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const hotelService = hotelServiceInterface(hotelServiceImpl());
    const handleBooking = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const bookingDetails = req.body;
            const userId = req.user;
            const data = yield (0, booking_1.default)(userId, bookingDetails, dbRepositoryBooking, dbRepositoryHotel, hotelService, dbRepositoryUser);
            if (data && data.paymentMethod === "Online") {
                const user = yield (0, profile_1.getUserProfile)(userId, dbRepositoryUser);
                if (typeof data.price === 'number') {
                    const sessionId = yield (0, booking_1.makePayment)(user === null || user === void 0 ? void 0 : user.name, user === null || user === void 0 ? void 0 : user.email, data._id.toString(), data.price);
                    res.status(httpStatus_1.HttpStatus.OK).json({
                        success: true,
                        message: "Booking created successfully",
                        id: sessionId,
                    });
                }
                else {
                    throw new Error('Invalid price for online payment');
                }
            }
            else if (data && data.paymentMethod === "Wallet") {
                const dates = yield (0, booking_1.addUnavilableDates)(data.rooms, (_a = data.checkInDate) !== null && _a !== void 0 ? _a : new Date(), (_b = data.checkOutDate) !== null && _b !== void 0 ? _b : new Date(), dbRepositoryHotel, hotelService);
                res.status(httpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Booking created successfully using Wallet",
                    booking: data,
                });
            }
            else {
                const dates = yield (0, booking_1.addUnavilableDates)(data.rooms, (_c = data.checkInDate) !== null && _c !== void 0 ? _c : new Date(), (_d = data.checkOutDate) !== null && _d !== void 0 ? _d : new Date(), dbRepositoryHotel, hotelService);
                res.status(httpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Booking created successfully ",
                    booking: data,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }));
    const updatePaymentStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { id } = req.params;
            const { paymentStatus } = req.body;
            if (paymentStatus === "Paid") {
                const bookings = yield (0, booking_1.getBookingByBookingId)(id, dbRepositoryBooking);
                if (bookings) {
                    const dates = yield (0, booking_1.addUnavilableDates)(bookings.rooms, (_a = bookings.checkInDate) !== null && _a !== void 0 ? _a : new Date(), (_b = bookings.checkOutDate) !== null && _b !== void 0 ? _b : new Date(), dbRepositoryHotel, hotelService);
                }
            }
            yield (0, booking_1.updateBookingStatus)(id, paymentStatus, dbRepositoryBooking, dbRepositoryHotel);
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Booking status updated" });
        }
        catch (error) {
            next(error);
        }
    });
    const getOwnerBookings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const OwnerId = req.owner;
            const hotels = yield (0, hotel_1.getMyHotels)(OwnerId, dbRepositoryHotel);
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
    /**wallet payment */
    const walletPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const transaction = yield (0, booking_1.getTransaction)(userId, dbRepositoryUser);
            res
                .status(200)
                .json({ success: true, transaction, message: "transactions" });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
    const addUnavilableDate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const data = req.body;
        const result = yield (0, booking_1.addUnavilableDates)(data.rooms, (_a = data.checkInDate) !== null && _a !== void 0 ? _a : new Date(), (_b = data.checkOutDate) !== null && _b !== void 0 ? _b : new Date(), dbRepositoryHotel, hotelService);
        res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "dates added successfully",
            result,
        });
    });
    /**update the wallet  */
    const changeWalletAmount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookingId, price } = req.body;
            const updateWallet = yield (0, booking_1.changeWallet)(bookingId, price, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
    const cancelBooking = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const userID = req.user;
            const { bookingID } = req.params;
            const { reason, status } = req.body;
            const updateBooking = yield (0, booking_1.cancelBookingAndUpdateWallet)(userID, bookingID, status, reason, dbRepositoryBooking, dbRepositoryUser, (0, bookingService_2.bookingServiceInterface)((0, bookingService_1.bookingService)()));
            if (updateBooking) {
                const dates = yield (0, booking_1.removeUnavilableDates)(updateBooking.rooms, (_a = updateBooking.checkInDate) !== null && _a !== void 0 ? _a : new Date(), (_b = updateBooking.checkOutDate) !== null && _b !== void 0 ? _b : new Date(), dbRepositoryHotel, hotelService);
            }
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Booking cancelled successfully",
                booking: updateBooking,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const updateBooking = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = req.user;
            const { reason, status } = req.body;
            const { bookingID } = req.params;
            const updateBooking = yield (0, booking_1.updateBookingDetails)(userID, status, reason, bookingID, dbRepositoryBooking, dbRepositoryUser);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Booking cancelled successfully",
                booking: updateBooking,
            });
        }
        catch (error) {
            next(error);
        }
    });
    /**
       * * METHOD :GET
       * * Retrieve  user wallet
       */
    const getWallet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const getWallet = yield (0, profile_1.getWalletUser)(id, dbRepositoryUser);
            res.status(200).json({ success: true, getWallet });
        }
        catch (error) {
            next(error);
        }
    });
    /**Method Get fetch transactions */
    const getTransactions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const transaction = yield (0, profile_1.WalletTransactions)(userId, dbRepositoryUser);
            res.status(200).json({
                success: true,
                transaction,
                message: "Transactions fetched successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getBookingDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const ID = req.params.id;
            const data = yield (0, booking_1.getBookingByBookingId)(ID, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllBookingDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = yield (0, booking_1.getBookingByUserId)(id, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    /**
     * *METHOD :GET
     * * Retrieve all bookings done by user
     */
    const getAllBooking = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = req.user;
            const bookings = yield (0, booking_1.getBookingByUserId)(userID, dbRepositoryBooking);
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
    /*
     * * METHOD :GET
     * * Retrieve booking details by hotel id
     */
    const getBookingList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = yield (0, booking_1.getBookingByHotelId)(id, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        handleBooking,
        updatePaymentStatus,
        getBookingDetails,
        getAllBookingDetails,
        getAllBooking,
        getBookingList,
        walletPayment,
        changeWalletAmount,
        cancelBooking,
        getTransactions,
        getWallet,
        addUnavilableDate,
        getOwnerBookings,
        updateBooking
    };
}
