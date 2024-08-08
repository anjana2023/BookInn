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
exports.getUserById = exports.deleteOtp = exports.verifyTokenResetPassword = exports.sendResetVerificationCode = exports.authenticateGoogleUser = exports.verifyOtpUser = exports.loginUser = exports.userRegister = void 0;
const user_1 = __importStar(require("../../../../entities/user"));
const httpStatus_1 = require("../../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const sendMail_1 = __importDefault(require("../../../../utils/sendMail"));
const userEmail_1 = require("../../../../utils/userEmail");
const userRegister = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, role } = user;
    const authenticationMethod = "password";
    const existingEmailUser = yield userRepository.getUserByEmail(email);
    if (existingEmailUser) {
        throw new appError_1.default("this email is already register with an account", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const hashedPassword = yield authService.encryptPassword(password);
    const userEntity = (0, user_1.default)(name, email, phoneNumber, hashedPassword, role, authenticationMethod);
    const newUser = yield userRepository.addUser(userEntity);
    const OTP = authService.generateOtp();
    yield userRepository.addOtp(OTP, newUser.id);
    const emailSubject = "Account verification";
    (0, sendMail_1.default)(newUser.email, emailSubject, (0, userEmail_1.otpEmail)(OTP, newUser.name));
    return newUser;
});
exports.userRegister = userRegister;
const loginUser = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = user;
    const isEmailExist = yield userRepository.getUserByEmail(email);
    if ((isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.authenticationMethod) === "google") {
        throw new appError_1.default("Only login with google", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (!isEmailExist) {
        throw new appError_1.default("Email Does Not Exist", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (isEmailExist.isBlocked) {
        throw new appError_1.default("Account is Blocked", httpStatus_1.HttpStatus.FORBIDDEN);
    }
    if (!isEmailExist.isVerified) {
        throw new appError_1.default("Account is not verified", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (!isEmailExist.password) {
        throw new appError_1.default("Invalid Credential", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const ispasswordMatched = yield authService.comparePassword(password, isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.password);
    if (!ispasswordMatched) {
        throw new appError_1.default("Password is Wrong", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } = authService.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
    return { accessToken, isEmailExist, refreshToken };
});
exports.loginUser = loginUser;
const verifyOtpUser = (otp, userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    if (!otp) {
        throw new appError_1.default("please provide an OTP", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const otpUser = yield userRepository.findOtpWithUser(userId);
    if (!otpUser) {
        throw new appError_1.default("Invlaid OTP ", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (otpUser.otp === otp) {
        const wallet = yield userRepository.addWallet(userId);
        yield userRepository.updateProfile(userId, {
            isVerified: true,
            wallet: wallet._id,
        });
        // await userRepository.updateUserverification(userId);
        return true;
    }
    else {
        throw new appError_1.default("Invalid OTP,try again", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyOtpUser = verifyOtpUser;
const authenticateGoogleUser = (userData, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, picture, email_verified, role } = userData;
    const authenticationMethod = "google";
    const isEmailExist = yield userRepository.getUserByEmail(email);
    if ((isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.authenticationMethod) === "password") {
        throw new appError_1.default("you can use login form", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.isBlocked) {
        throw new appError_1.default("Your account is blocked by administrator", httpStatus_1.HttpStatus.FORBIDDEN);
    }
    if (isEmailExist) {
        const { accessToken, refreshToken } = authService.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
        return {
            isEmailExist,
            accessToken,
            refreshToken
        };
    }
    else {
        const googleUser = (0, user_1.GoogleSignInUserEntity)(name, email, picture, email_verified, role, authenticationMethod);
        const newUser = yield userRepository.registerGoogleoUser(googleUser);
        const wallet = yield userRepository.addWallet(newUser.id);
        const userId = newUser._id;
        const Name = newUser.name;
        const accessToken = authService.createTokens(userId, Name, role);
        return { accessToken, newUser };
    }
});
exports.authenticateGoogleUser = authenticateGoogleUser;
const sendResetVerificationCode = (email, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailExist = yield userRepository.getUserByEmail(email);
    if ((isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.authenticationMethod) === "google") {
        throw new appError_1.default(`${email} is sign in using google signin method .Do not reset the password `, httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (!isEmailExist)
        throw new appError_1.default(`${email} does not exist`, httpStatus_1.HttpStatus.BAD_REQUEST);
    const verificationCode = authService.getRandomString();
    const isUpdated = yield userRepository.updateVerificationCode(email, verificationCode);
    (0, sendMail_1.default)(email, "Reset password", (0, userEmail_1.forgotPasswordEmail)(isEmailExist.name, verificationCode));
});
exports.sendResetVerificationCode = sendResetVerificationCode;
const verifyTokenResetPassword = (verificationCode, password, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    if (!verificationCode)
        throw new appError_1.default("Please provide a verification code", httpStatus_1.HttpStatus.BAD_REQUEST);
    const hashedPassword = yield authService.encryptPassword(password);
    const isPasswordUpdated = yield userRepository.verifyAndResetPassword(verificationCode, hashedPassword);
    if (!isPasswordUpdated) {
        throw new appError_1.default("Invalid token or token expired", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyTokenResetPassword = verifyTokenResetPassword;
const deleteOtp = (userId, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const newOtp = authService.generateOtp();
    const deleted = yield userRepository.deleteOtpWithUser(userId);
    if (deleted) {
        yield userRepository.addOtp(newOtp, userId);
    }
    const user = yield userRepository.getUserById(userId);
    if (!user) {
        throw new appError_1.default("User not found", httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const emailSubject = "Account verification ,New Otp";
    (0, sendMail_1.default)(user.email, emailSubject, (0, userEmail_1.otpEmail)(newOtp, user.name));
});
exports.deleteOtp = deleteOtp;
const getUserById = (id, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.getUserById(id); });
exports.getUserById = getUserById;
