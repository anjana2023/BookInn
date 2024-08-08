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
const httpStatus_1 = require("../../types/httpStatus");
const adminAuth_1 = require("../../app/usecases/admin/auth/adminAuth");
const adminRead_1 = require("../../app/usecases/admin/adminRead");
const adminUpdate_1 = require("../../app/usecases/admin/adminUpdate");
const hotel_1 = require("../../app/usecases/owner/hotel");
const hotel_2 = require("../../app/usecases/User/read&write/hotel");
const adminController = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl, ownerDbRepository, ownerDbRepositoryImpl, hotelDbRepository, hotelDbRepositoryImpl, bookingDbRepository, bookingDbRepositoryImpl) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbUserRepository = userDbRepository(userDbRepositoryImpl());
    const dbOwnerRepository = ownerDbRepository(ownerDbRepositoryImpl());
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImpl());
    const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = yield (0, adminAuth_1.loginAdmin)(email, password, authService);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Admin login success",
                admin: {
                    name: "Admin_User",
                    role: "admin",
                },
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, adminRead_1.getUsers)(dbUserRepository);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, users });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllOwners = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const owners = yield (0, adminRead_1.getOwners)(dbOwnerRepository);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, owners });
        }
        catch (error) {
            next(error);
        }
    });
    const userBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, adminUpdate_1.blockUser)(id, dbUserRepository);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "User blocked Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const ownerBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, adminUpdate_1.blockOwner)(id, dbOwnerRepository);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Vendor blocked Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllHotels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const Hotels = yield (0, hotel_1.getHotels)(dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotels });
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
    /* method patch verify in admin */
    const VerifyHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const doctor = yield (0, hotel_1.getHotel)(id, status, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, doctor, message: "Verified Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    /* method patch rejection in admin */
    const rejectionHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const { reason } = req.body;
            const hotel = yield (0, hotel_1.getHotelRejected)(id, status, reason, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, hotel, message: "Verified Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const getBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, adminRead_1.getALLBookings)(dbRepositoryBooking);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted booking",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name } = req.body; // Destructure name from req.body
            const result = yield (0, adminRead_1.addStayType)(name, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: "Stay Type added Successfully" });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Failed to add Stay Type" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    return {
        adminLogin,
        getAllUsers,
        getAllOwners,
        userBlock,
        ownerBlock,
        getAllHotels,
        hotelDetails,
        VerifyHotel,
        getBookings,
        rejectionHotel,
        addCategory
    };
};
exports.default = adminController;
