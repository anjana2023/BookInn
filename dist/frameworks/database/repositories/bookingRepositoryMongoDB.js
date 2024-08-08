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
exports.default = bookingDbRepository;
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const wallet_1 = __importDefault(require("../models/wallet"));
const transaction_1 = __importDefault(require("../models/transaction"));
function bookingDbRepository() {
    const createBooking = (bookingEntity) => __awaiter(this, void 0, void 0, function* () {
        const newBooking = new bookingModel_1.default({
            firstName: bookingEntity.getfirstName(),
            lastName: bookingEntity.getlastName(),
            phoneNumber: bookingEntity.getPhoneNumber(),
            email: bookingEntity.getEmail(),
            hotelId: bookingEntity.getHotelId(),
            userId: bookingEntity.getUserId(),
            maxAdults: bookingEntity.getMaxAdults(),
            checkInDate: bookingEntity.getCheckInDate(),
            checkOutDate: bookingEntity.getCheckOutDate(),
            totalDays: bookingEntity.getTotalDays(),
            price: bookingEntity.getPrice(),
            platformFee: bookingEntity.getPlatformFee(),
            rooms: bookingEntity.getRooms(),
            paymentMethod: bookingEntity.getPaymentMethod(),
        });
        newBooking.save();
        return newBooking;
    });
    const getAllBooking = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find()
                .sort({ updatedAt: -1 })
                .populate("userId")
                .populate("hotelId");
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching all bookings");
        }
    });
    const getBookingBybookingId = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const booking = yield bookingModel_1.default.findOne({ bookingId: id }).populate("userId").populate("hotelId");
            return booking;
        }
        catch (error) {
            throw new Error("Error fetching booking by booking ID");
        }
    });
    const getBookingByHotels = (ids) => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find({ hotelId: ids })
                .populate("userId")
                .populate("hotelId");
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching bookings by hotel ID");
        }
    });
    const getBooking = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const booking = yield bookingModel_1.default.findById(id)
                .populate("userId")
                .populate("hotelId")
                .populate("hotelId.ownerId");
            return booking;
        }
        catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Error fetching booking by ID");
        }
    });
    const deleteBooking = (id) => __awaiter(this, void 0, void 0, function* () {
        return yield bookingModel_1.default.findByIdAndUpdate(id, { $set: { status: "cancelled" } }, { new: true });
    });
    const updateBooking = (bookingId, updatingData) => __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedBooking = yield bookingModel_1.default.findOneAndUpdate({ bookingId }, updatingData, { new: true, upsert: true }).populate({
                path: "hotelId",
                populate: {
                    path: "ownerId"
                }
            });
            return updatedBooking;
        }
        catch (error) {
            throw new Error("Error updating booking");
        }
    });
    const changeBookingstatusPayment = (id) => __awaiter(this, void 0, void 0, function* () {
        return yield bookingModel_1.default.findByIdAndUpdate(id, { paymentStatus: "Paid" });
    });
    const updateBookings = (bookingId, updatingData) => __awaiter(this, void 0, void 0, function* () {
        return yield bookingModel_1.default.findOneAndUpdate({ bookingId }, { paymentStatus: "Paid" });
    });
    const getWalletBalance = (userId) => __awaiter(this, void 0, void 0, function* () {
        const walletData = yield wallet_1.default.findOne({ userId: userId });
        const balanceAmount = walletData === null || walletData === void 0 ? void 0 : walletData.balance;
        return balanceAmount;
    });
    const amountDebit = (userId, Amount) => __awaiter(this, void 0, void 0, function* () {
        const WalletId = yield wallet_1.default.findOne({ userId: userId });
        const walletTransaction = yield transaction_1.default.create({
            walletId: WalletId,
            userId: userId,
            amount: Amount,
            type: "Debit",
            Description: "Wallet Payment"
        });
    });
    const changeTheWallet = (fees, UserId) => __awaiter(this, void 0, void 0, function* () {
        const walletData = yield wallet_1.default.findOne({ userId: UserId });
        if (!walletData) {
            throw new Error("Wallet not found");
        }
        const newBalance = walletData.balance - fees;
        //@ts-ignore
        walletData === null || walletData === void 0 ? void 0 : walletData.balance = newBalance;
        yield walletData.save();
    });
    const changeBookingStatus = (BookingStatus, cancelReason, id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield bookingModel_1.default.findByIdAndUpdate(id, { status: BookingStatus, cancelReason: cancelReason });
            return res;
        }
        catch (error) {
            console.error('Error updating booking status:', error);
        }
    });
    const getBookingById = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield bookingModel_1.default.findById({ _id: bookingId }); });
    const amountCredit = (fee, UserId) => __awaiter(this, void 0, void 0, function* () {
        const WalletId = yield wallet_1.default.findOne({ userId: UserId });
        const walletTransaction = yield transaction_1.default.create({
            walletId: WalletId,
            userId: UserId,
            amount: fee,
            type: "Credit",
            Description: "Refund Amound"
        });
    });
    const getAllBookingByUserId = (userId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find({ userId: userId }).populate("userId").populate("hotelId").sort({ createdAt: -1 });
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching bookings by user ID");
        }
    });
    const getAllBookingByHotelId = (hotelId) => __awaiter(this, void 0, void 0, function* () { return yield bookingModel_1.default.find({ hotelId: hotelId }); });
    return {
        createBooking,
        getAllBooking,
        getBooking,
        deleteBooking,
        updateBooking,
        changeBookingstatusPayment,
        updateBookings,
        getAllBookingByUserId,
        getAllBookingByHotelId,
        getWalletBalance,
        amountCredit,
        amountDebit,
        getBookingById,
        changeTheWallet,
        changeBookingStatus,
        getBookingBybookingId,
        getBookingByHotels
    };
}
