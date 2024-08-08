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
exports.changeWallet = exports.walletDebit = exports.getWalletBalance = exports.updateBookingDetails = exports.getBookingsByHotels = exports.getBookingByHotelId = exports.getBookingByUserId = exports.getBookingByBookingId = exports.updateBookingStatus = exports.updateBookingStatusPayment = exports.getTransaction = exports.makePayment = exports.checkAvailability = exports.addUnavilableDates = exports.updateWallet = exports.cancelBookingAndUpdateWallet = exports.removeUnavilableDates = exports.changeWalletAmounti = void 0;
exports.default = createBooking;
const mongoose_1 = __importDefault(require("mongoose"));
const stripe_1 = __importDefault(require("stripe"));
const booking_1 = __importDefault(require("../../../entities/booking"));
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const config_1 = __importDefault(require("../../../config"));
const transactionEntity_1 = __importDefault(require("../../../entities/transactionEntity"));
function createBooking(userId, bookingDetails, bookingRepository, hotelRepository, hotelSerice, userRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, phoneNumber, email, hotelId, maxAdults, maxChildren, rooms, checkInDate, checkOutDate, totalDays, price, platformFee, paymentMethod, } = bookingDetails;
        if (!firstName ||
            !lastName ||
            !phoneNumber ||
            !email ||
            !hotelId ||
            !userId ||
            !maxAdults ||
            !rooms ||
            !checkInDate ||
            !checkOutDate ||
            !price ||
            !platformFee ||
            !totalDays ||
            !paymentMethod) {
            throw new appError_1.default("Missing fields in Booking", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const bookingEntity = (0, booking_1.default)(firstName, lastName, phoneNumber, email, new mongoose_1.default.Types.ObjectId(hotelId), new mongoose_1.default.Types.ObjectId(userId), maxAdults, maxChildren, checkInDate, checkOutDate, totalDays, rooms, price, platformFee, paymentMethod);
        const data = yield bookingRepository.createBooking(bookingEntity);
        if (data.paymentMethod === "Wallet") {
            const wallet = yield userRepository.getWallet(data.userId);
            if (wallet && data && data.price && (wallet === null || wallet === void 0 ? void 0 : wallet.balance) >= data.price) {
                const transactionData = {
                    newBalance: data.price,
                    type: "Debit",
                    description: "Booking transaction",
                };
                yield (0, exports.updateWallet)(data.userId, transactionData, userRepository);
                yield (0, exports.updateBookingStatus)(data._id, "Paid", bookingRepository, hotelRepository);
            }
            else {
                throw new appError_1.default("Insufficient wallet balance", httpStatus_1.HttpStatus.BAD_REQUEST);
            }
        }
        return data;
    });
}
const changeWalletAmounti = (UserId, fees, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const changeupdated = yield bookingRepository.changeTheWalletAmount(fees, UserId);
});
exports.changeWalletAmounti = changeWalletAmounti;
const removeUnavilableDates = (rooms, checkInDate, checkOutDate, hotelRepository, hotelService) => __awaiter(void 0, void 0, void 0, function* () {
    const dates = yield hotelService.unavailbleDates(checkInDate.toString(), checkOutDate.toString());
    const addDates = yield hotelRepository.removeUnavailableDates(rooms, dates);
});
exports.removeUnavilableDates = removeUnavilableDates;
const cancelBookingAndUpdateWallet = (userID, bookingID, status, reason, bookingRepository, userRepository, bookingService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!bookingID) {
        throw new appError_1.default("Please provide a booking ID", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const bookingDetails = yield bookingRepository.updateBooking(bookingID, {
        bookingStatus: status,
        Reason: reason,
    });
    let bookerId;
    if (bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.userId) {
        if (typeof bookingDetails.userId === "string") {
            bookerId = bookingDetails.userId;
        }
        else if (bookingDetails.userId instanceof mongoose_1.default.Types.ObjectId) {
            bookerId = bookingDetails.userId.toString();
        }
    }
    if (bookingDetails && bookingDetails.paymentMethod !== "pay_on_checkout") {
        if (bookingDetails.status === "cancelled") {
            const dateDifference = yield bookingService.dateDifference(bookingDetails.updatedAt, (_a = bookingDetails.checkInDate) !== null && _a !== void 0 ? _a : 0);
            const paidPrice = bookingDetails.price;
            if (paidPrice !== undefined && paidPrice !== null) {
                const platformFee = paidPrice * 0.05;
                let refundAmount = paidPrice - platformFee;
                if (dateDifference !== undefined && dateDifference > 2) {
                    const isRoomCountLessThanOrEqualTo5 = bookingDetails.rooms.length <= 5;
                    if (isRoomCountLessThanOrEqualTo5) {
                        if (dateDifference > 7) {
                            refundAmount = refundAmount;
                        }
                        else if (dateDifference <= 7) {
                            refundAmount /= 2;
                        }
                    }
                    else {
                        if (dateDifference > 10) {
                            refundAmount = refundAmount;
                        }
                        else if (dateDifference <= 10) {
                            refundAmount /= 2;
                        }
                    }
                    const data = {
                        newBalance: refundAmount,
                        type: "Credit",
                        description: "Booking cancelled by user refund amount",
                    };
                    if (bookerId !== undefined && bookerId !== null) {
                        yield (0, exports.updateWallet)(bookerId, data, userRepository);
                    }
                    const updateBooking = yield bookingRepository.updateBooking(bookingID, {
                        bookingStatus: "cancelled with refund",
                        paymentStatus: "Refunded",
                    });
                }
                else {
                    console.error("Date difference is less than 2 or undefined");
                }
            }
        }
        else {
            const data = {
                newBalance: (_b = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.price) !== null && _b !== void 0 ? _b : 0,
                type: "Credit",
                description: "Booking cancelled by owner refund amount",
            };
            if (bookerId !== undefined && bookerId !== null) {
                yield (0, exports.updateWallet)(bookerId, data, userRepository);
            }
            const updateBooking = yield bookingRepository.updateBooking(bookingID, {
                bookingStatus: "cancelled with refund",
                paymentStatus: "Refunded",
            });
        }
    }
    return bookingDetails;
});
exports.cancelBookingAndUpdateWallet = cancelBookingAndUpdateWallet;
const updateWallet = (userId, transactionData, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { newBalance, type, description } = transactionData;
    const balance = type === "Debit" ? -newBalance : newBalance;
    const updateWallet = yield userRepository.updateWallet(userId, balance);
    if (updateWallet) {
        const transactionDetails = (0, transactionEntity_1.default)(updateWallet === null || updateWallet === void 0 ? void 0 : updateWallet._id, newBalance, type, description);
        const transaction = yield userRepository.createTransaction(transactionDetails);
    }
});
exports.updateWallet = updateWallet;
const addUnavilableDates = (rooms, checkInDate, checkOutDate, hotelRepository, hotelService) => __awaiter(void 0, void 0, void 0, function* () {
    const dates = yield hotelService.unavailbleDates(checkInDate.toString(), checkOutDate.toString());
    const addDates = yield hotelRepository.addUnavilableDates(rooms, dates);
});
exports.addUnavilableDates = addUnavilableDates;
const checkAvailability = (id, dates, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield hotelRepository.checkAvailability(id, dates.checkInDate, dates.checkOutDate);
});
exports.checkAvailability = checkAvailability;
const makePayment = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (userName = "John Doe", email = "johndoe@gmail.com", bookingId, totalAmount) {
    const stripe = new stripe_1.default(config_1.default.STRIPE_SECRET_KEY);
    const customer = yield stripe.customers.create({
        name: userName,
        email: email,
        address: {
            line1: "Los Angeles, LA",
            country: "US",
        },
    });
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: { name: "Guests", description: "Room booking" },
                    unit_amount: Math.round(totalAmount * 100),
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${config_1.default.CLIENT_PORT}/payment_status/${bookingId}?success=true`,
        cancel_url: `${config_1.default.CLIENT_PORT}/payment_status/${bookingId}?success=false`,
    });
    return session.id;
});
exports.makePayment = makePayment;
const getTransaction = (userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield userRepository.getWallet(userId);
    if (!wallet) {
        throw new Error('Wallet not found');
    }
    const walletID = wallet._id;
    const transactions = yield userRepository.getTransaction(walletID);
    return transactions;
});
exports.getTransaction = getTransaction;
const updateBookingStatusPayment = (id, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield bookingRepository.changeBookingstatusPayment(id);
    return status;
});
exports.updateBookingStatusPayment = updateBookingStatusPayment;
const updateBookingStatus = (id, paymentStatus, bookingRepository, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const updationData = {
        paymentStatus,
    };
    const bookingData = yield bookingRepository.updateBooking(id, updationData);
});
exports.updateBookingStatus = updateBookingStatus;
const getBookingByBookingId = (userID, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield bookingRepository.getBooking(userID); });
exports.getBookingByBookingId = getBookingByBookingId;
const getBookingByUserId = (userId, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDetails = yield bookingRepository.getAllBookingByUserId(userId);
    return { bookingDetails };
});
exports.getBookingByUserId = getBookingByUserId;
const getBookingByHotelId = (doctorId, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDetails = yield bookingRepository.getAllBookingByHotelId(doctorId);
    return { bookingDetails };
});
exports.getBookingByHotelId = getBookingByHotelId;
const getBookingsByHotels = (userID, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield bookingRepository.getBookingByHotels(userID); });
exports.getBookingsByHotels = getBookingsByHotels;
const updateBookingDetails = (userID, status, reason, bookingID, bookingRepository, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    if (!bookingID)
        throw new appError_1.default("Please provide a booking ID", httpStatus_1.HttpStatus.BAD_REQUEST);
    let bookingDetails;
    if (status === "booked") {
        bookingDetails = yield bookingRepository.updateBooking(bookingID, {
            bookingStatus: status,
        });
    }
    else {
        bookingDetails = yield bookingRepository.updateBooking(bookingID, {
            bookingStatus: status,
            Reason: reason,
        });
    }
    return bookingDetails;
});
exports.updateBookingDetails = updateBookingDetails;
const getWalletBalance = (userId, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield bookingRepository.getBalanceAmount(userId);
    return balance;
});
exports.getWalletBalance = getWalletBalance;
const walletDebit = (userId, Amount, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const debit = yield bookingRepository.debitAmount(userId, Amount);
});
exports.walletDebit = walletDebit;
const changeWallet = (bookingId, price, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve the booking entity by its ID
    const booking = yield bookingRepository.getBookingById(bookingId);
    //@ts-ignore
    const UserId = booking === null || booking === void 0 ? void 0 : booking.userId;
    const changeupdated = yield bookingRepository.changeTheWalletAmount(price, UserId);
});
exports.changeWallet = changeWallet;
