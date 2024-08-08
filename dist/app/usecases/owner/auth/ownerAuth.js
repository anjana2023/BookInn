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
exports.getOwnerById = exports.deleteOtp = exports.verifyTokenResetPassword = exports.sendResetVerificationCode = exports.authenticateGoogleOwner = exports.verifyOtpOwner = exports.loginOwner = exports.getSingleOwner = exports.getSingleUser = exports.OwnerRegister = void 0;
const owner_1 = __importStar(require("../../../../entities/owner"));
const httpStatus_1 = require("../../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const sendMail_1 = __importDefault(require("../../../../utils/sendMail"));
const userEmail_1 = require("../../../../utils/userEmail");
const OwnerRegister = (owner, ownerRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, role } = owner;
    const existingEmailOwner = yield ownerRepository.getOwnerByEmail(email);
    if (existingEmailOwner) {
        throw new appError_1.default("this email is already register with an account", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const hashedPassword = yield authService.encryptPassword(password);
    const ownerEntity = (0, owner_1.default)(name, email, phoneNumber, hashedPassword, role);
    const newOwner = yield ownerRepository.addOwner(ownerEntity);
    const OTP = authService.generateOtp();
    yield ownerRepository.addOtp(OTP, newOwner.id);
    const emailSubject = "Account verification";
    (0, sendMail_1.default)(newOwner.email, emailSubject, (0, userEmail_1.otpEmail)(OTP, newOwner.name));
    return newOwner;
});
exports.OwnerRegister = OwnerRegister;
const getSingleUser = (id, userDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userDbRepository.getUserById(id); });
exports.getSingleUser = getSingleUser;
const getSingleOwner = (id, ownerRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield ownerRepository.getOwnerById(id); });
exports.getSingleOwner = getSingleOwner;
const loginOwner = (owner, ownerRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = owner;
    const isEmailExist = yield ownerRepository.getOwnerByEmail(email);
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
exports.loginOwner = loginOwner;
const verifyOtpOwner = (otp, ownerId, ownerRepository) => __awaiter(void 0, void 0, void 0, function* () {
    if (!otp) {
        throw new appError_1.default("please provide an OTP", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const otpOwner = yield ownerRepository.findOtpWithOwner(ownerId);
    if (!otpOwner) {
        throw new appError_1.default("Invlaid OTP ", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (otpOwner.otp === otp) {
        yield ownerRepository.updateOwnerverification(ownerId);
        return true;
    }
    else {
        throw new appError_1.default("Invalid OTP,try again", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyOtpOwner = verifyOtpOwner;
const authenticateGoogleOwner = (ownerData, ownerRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, picture, email_verified, role } = ownerData;
    const isEmailExist = yield ownerRepository.getOwnerByEmail(email);
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
        const googleOwner = (0, owner_1.GoogleSignInOwnerEntity)(name, email, picture, email_verified, role);
        const newOwner = yield ownerRepository.registerGoogleOwner(googleOwner);
        const ownerId = newOwner._id;
        const Name = newOwner.name;
        const { accessToken, refreshToken } = authService.createTokens(ownerId, Name, role);
        return { accessToken, newOwner, refreshToken };
    }
});
exports.authenticateGoogleOwner = authenticateGoogleOwner;
const sendResetVerificationCode = (email, ownerRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailExist = yield ownerRepository.getOwnerByEmail(email);
    if (!isEmailExist)
        throw new appError_1.default(`${email} does not exist`, httpStatus_1.HttpStatus.BAD_REQUEST);
    const verificationCode = authService.getRandomString();
    const isUpdated = yield ownerRepository.updateVerificationCode(email, verificationCode);
    (0, sendMail_1.default)(email, "Reset password", (0, userEmail_1.forgotPasswordEmail)(isEmailExist.name, verificationCode));
});
exports.sendResetVerificationCode = sendResetVerificationCode;
const verifyTokenResetPassword = (verificationCode, password, ownerRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    if (!verificationCode)
        throw new appError_1.default("Please provide a verification code", httpStatus_1.HttpStatus.BAD_REQUEST);
    const hashedPassword = yield authService.encryptPassword(password);
    const isPasswordUpdated = yield ownerRepository.verifyAndResetPassword(verificationCode, hashedPassword);
    if (!isPasswordUpdated) {
        throw new appError_1.default("Invalid token or token expired", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyTokenResetPassword = verifyTokenResetPassword;
const deleteOtp = (ownerId, ownerRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const newOtp = authService.generateOtp();
    const deleted = yield ownerRepository.deleteOtpWithOwner(ownerId);
    if (deleted) {
        yield ownerRepository.addOtp(newOtp, ownerId);
    }
    const owner = yield ownerRepository.getOwnerById(ownerId);
    if (!owner) {
        throw new appError_1.default("Owner not found", httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const emailSubject = "Account verification ,New Otp";
    (0, sendMail_1.default)(owner.email, emailSubject, (0, userEmail_1.otpEmail)(newOtp, owner.name));
});
exports.deleteOtp = deleteOtp;
const getOwnerById = (id, doctorRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield doctorRepository.getOwnerById(id); });
exports.getOwnerById = getOwnerById;
