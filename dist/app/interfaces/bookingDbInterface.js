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
exports.default = bookingDbInterface;
function bookingDbInterface(repository) {
    const createBooking = (bookingEntity) => __awaiter(this, void 0, void 0, function* () { return yield repository.createBooking(bookingEntity); });
    const getAllBooking = () => __awaiter(this, void 0, void 0, function* () { return yield repository.getAllBooking(); });
    const getAllBookingByUserId = (userId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getAllBookingByUserId(userId); });
    const getAllBookingByHotelId = (doctorId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getAllBookingByHotelId(doctorId); });
    const changeBookingstatus = (BookingStatus, cancelReason, id) => __awaiter(this, void 0, void 0, function* () { return yield repository.changeBookingStatus(BookingStatus, cancelReason, id); });
    const getBookingByHotels = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingByHotels(bookingId); });
    const getBooking = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBooking(bookingId); });
    const deleteBooking = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.deleteBooking(bookingId); });
    const updateBooking = (bookingId, updates) => __awaiter(this, void 0, void 0, function* () { return yield repository.updateBooking(bookingId, updates); });
    const changeBookingstatusPayment = (id) => __awaiter(this, void 0, void 0, function* () { return yield repository.changeBookingstatusPayment(id); });
    const updateBookingDetails = (bookingId, updatingData) => __awaiter(this, void 0, void 0, function* () { return yield repository.updateBookings(bookingId, updatingData); });
    const getBalanceAmount = (userId) => __awaiter(this, void 0, void 0, function* () {
        const balance = yield repository.getWalletBalance(userId);
        return balance;
    });
    const changeTheWalletAmount = (fees, UserId) => __awaiter(this, void 0, void 0, function* () {
        yield repository.changeTheWallet(fees, UserId);
    });
    const debitAmount = (userId, Amount) => __awaiter(this, void 0, void 0, function* () {
        const amount = yield repository.amountDebit(userId, Amount);
    });
    const creditAmount = (price, UserId) => __awaiter(this, void 0, void 0, function* () {
        const amount = yield repository.amountCredit(price, UserId);
    });
    const getBookingById = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingById(bookingId); });
    return {
        createBooking,
        getAllBooking,
        getBooking,
        deleteBooking,
        updateBooking,
        changeBookingstatusPayment,
        updateBookingDetails,
        getAllBookingByUserId,
        getAllBookingByHotelId,
        getBalanceAmount,
        debitAmount,
        creditAmount,
        getBookingById,
        changeTheWalletAmount,
        changeBookingstatus,
        getBookingByHotels
    };
}
