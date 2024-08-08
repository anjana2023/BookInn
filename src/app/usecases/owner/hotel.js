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
exports.blockHotel = exports.updateHotel = exports.HotelRejected = exports.getHotelRejected = exports.getMyHotels = exports.getHotel = exports.getHotels = exports.addRoom = exports.addHotel = void 0;
const hotel_1 = __importDefault(require("../../../entities/hotel"));
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const hotelVerifcationRejectionEmail_1 = require("../../../utils/hotelVerifcationRejectionEmail");
const sendMail_1 = __importDefault(require("../../../utils/sendMail"));
const room_1 = __importDefault(require("../../../entities/room"));
const addHotel = (ownerId, hotel, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, place, description, propertyRules, stayType, address, amenities, imageUrls, hotelDocument, } = hotel;
    const existingHotel = yield hotelRepository.getHotelByName(name);
    const existingEmail = yield hotelRepository.getHotelByEmail(email);
    if (existingHotel) {
        throw new appError_1.default("Hotel with this name already exists", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (existingEmail) {
        throw new appError_1.default("Email with this email already exists", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const hotelEntity = (0, hotel_1.default)(name, email, ownerId, place, description, propertyRules, stayType, address, amenities, imageUrls, hotelDocument);
    const newHotel = yield hotelRepository.addHotel(hotelEntity);
    return newHotel;
});
exports.addHotel = addHotel;
const addRoom = (hotelId, hotel, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price, desc, maxChildren, maxAdults, roomNumbers } = hotel;
    // Correctly map the roomNumbers array
    const formattedRoomNumbers = roomNumbers.map((num) => ({
        number: num,
        unavailableDates: []
    }));
    const roomEntity = (0, room_1.default)(title, price, desc, maxChildren, maxAdults, formattedRoomNumbers);
    const newHotel = yield hotelRepository.addRoom(roomEntity, hotelId);
    return newHotel;
});
exports.addRoom = addRoom;
const getHotels = (hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getAllHotels(); });
exports.getHotels = getHotels;
const getHotel = (id, status, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getHotel(id, status); });
exports.getHotel = getHotel;
const getMyHotels = (ownerId, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getMyHotels(ownerId); });
exports.getMyHotels = getMyHotels;
const getHotelRejected = (id, status, reason, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    yield hotelRepository.getHotelByIdUpdateRejected(id, status, reason);
    const hotel = yield hotelRepository.getHotelById(id);
    const { name, email } = hotel;
    if (hotel) {
        const emailSubject = "Verification Rejected";
        (0, sendMail_1.default)(email, emailSubject, (0, hotelVerifcationRejectionEmail_1.hotelVerificationRejectedEmailPage)(name, reason));
    }
    else {
        console.error("Doctor not found");
    }
});
exports.getHotelRejected = getHotelRejected;
const HotelRejected = (hotelID, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield hotelRepository.getRejectedHotelById(hotelID);
    return doctor;
});
exports.HotelRejected = HotelRejected;
const updateHotel = (hotelId, updates, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.updateHotel(hotelId, updates); });
exports.updateHotel = updateHotel;
const blockHotel = (id, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel = yield hotelRepository.getHotelById(id);
    if (!hotel) {
        throw new Error("Hotel not found");
    }
    const updatedHotel = yield hotelRepository.updateHotelBlock(id, !hotel.isBlocked);
    return updatedHotel;
});
exports.blockHotel = blockHotel;
