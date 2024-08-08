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
exports.getALLBookings = exports.addStayType = exports.fetchAllBookings = exports.getOwners = exports.getUsers = void 0;
const getUsers = (userDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userDbRepository.getAllUsers(); });
exports.getUsers = getUsers;
const getOwners = (ownerDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield ownerDbRepository.getAllOwners(); });
exports.getOwners = getOwners;
const fetchAllBookings = (hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelDbRepository.getAllBookings(); });
exports.fetchAllBookings = fetchAllBookings;
const addStayType = (name, hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelDbRepository.addStayType(name); });
exports.addStayType = addStayType;
const getALLBookings = (bookingRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield bookingRepository.getAllBooking(); });
exports.getALLBookings = getALLBookings;
