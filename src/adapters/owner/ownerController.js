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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const hotel_1 = require("../../app/usecases/User/read&write/hotel");
const ownerAuth_1 = require("../../app/usecases/owner/auth/ownerAuth");
const httpStatus_1 = require("../../types/httpStatus");
const ownerProfile_1 = require("../../app/usecases/owner/auth/read&write/ownerProfile");
const profile_1 = require("../../app/usecases/User/read&write/profile");
const authController = (authServiceInterface, authServiceImpl, ownerDbRepository, ownerDbRepositoryImpl, hotelDbRepository, hotelDbRepositoryImpl, userDbRepository, userDbRepositoryImpl) => {
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const dbRepositoryOwner = ownerDbRepository(ownerDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const registerOwner = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const owner = req.body;
            const newOwner = yield (0, ownerAuth_1.OwnerRegister)(owner, dbRepositoryOwner, authService);
            res.json({
                status: "success",
                message: "otp is sended to the email",
                newOwner,
            });
        }
        catch (error) {
            next(error);
        }
    }));
    const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp, ownerid } = req.body;
            const isVerified = yield (0, ownerAuth_1.verifyOtpOwner)(otp, ownerid, dbRepositoryOwner);
            if (isVerified) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ message: "Owner account is verified, please login" });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ message: "Invalid OTP, please try again" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ownerId } = req.body;
            yield (0, ownerAuth_1.deleteOtp)(ownerId, dbRepositoryOwner, authService);
            res.json({ message: "New otp sent to mail" });
        }
        catch (error) {
            next(error);
        }
    });
    const ownerLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken, refreshToken, isEmailExist } = yield (0, ownerAuth_1.loginOwner)(req.body, dbRepositoryOwner, authService);
            res.json({
                status: "success",
                message: "owner logined",
                access_token: accessToken,
                refresh_token: refreshToken,
                owner: isEmailExist,
            });
        }
        catch (error) {
            next(error);
        }
    }));
    const GoogleSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ownerData = req.body;
            const { accessToken, refreshToken, isEmailExist, newOwner } = yield (0, ownerAuth_1.authenticateGoogleOwner)(ownerData, dbRepositoryOwner, authService);
            const owner = isEmailExist ? isEmailExist : newOwner;
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ message: "login success", owner, access_token: accessToken,
                refresh_token: refreshToken });
        }
        catch (error) {
            next(error);
        }
    });
    const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const user = yield (0, profile_1.getUserProfile)(userId, dbRepositoryUser);
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const updatedData = req.body;
            const user = yield (0, profile_1.updateUser)(userId, updatedData, dbRepositoryUser);
            res
                .status(200)
                .json({ success: true, user, message: "Profile updated successfully" });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
    const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            yield (0, ownerAuth_1.sendResetVerificationCode)(email, dbRepositoryOwner, authService);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Reset password code sent to your mail",
            });
        }
        catch (error) {
            next(error);
        }
    });
    const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const { token } = req.params;
            yield (0, ownerAuth_1.verifyTokenResetPassword)(token, password, dbRepositoryOwner, authService);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Reset password success,you can login with your new password",
            });
        }
        catch (error) {
            next(error);
        }
    });
    const ownerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.owner;
            const user = yield (0, ownerProfile_1.getOwnerProfile)(userId, dbRepositoryOwner);
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.owner;
            const updatedData = req.body;
            const user = yield (0, ownerProfile_1.updateOwner)(userId, updatedData, dbRepositoryOwner);
            res
                .status(200)
                .json({ success: true, user, message: "Profile updated successfully" });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
    const verifyPhoneNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        yield (0, ownerProfile_1.verifyNumber)(phone, dbRepositoryOwner);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "otp is sended to your phone number",
        });
    });
    const hotelDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const Hotel = yield (0, hotel_1.getHotelDetails)(id, dbRepositoryHotel);
            if (!Hotel) {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, error: "Hotel not found" });
            }
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotel });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        registerOwner,
        ownerLogin,
        verifyOtp,
        GoogleSignIn,
        resetPassword,
        resendOtp,
        forgotPassword,
        verifyPhoneNumber,
        updateProfile,
        ownerProfile,
        hotelDetails,
        getUserById,
        getUser
    };
};
exports.default = authController;
