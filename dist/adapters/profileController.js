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
const profile_1 = require("../app/usecases/User/read&write/profile");
const httpStatus_1 = require("../types/httpStatus");
const profileController = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl) => {
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const userProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const user = yield (0, profile_1.getUserProfile)(userId, dbRepositoryUser);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
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
    const verifyPhoneNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        yield (0, profile_1.verifyNumber)(phone, dbRepositoryUser);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "otp is sended to your phone number",
        });
    });
    return {
        userProfile,
        updateProfile,
        verifyPhoneNumber,
    };
};
exports.default = profileController;
