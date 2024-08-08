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
exports.ownerDbInterface = void 0;
const ownerDbInterface = (repository) => {
    const getOwnerByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getOwnerEmail(email); });
    const getOwnerById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getOwnerbyId(id); });
    const addOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addOwner(owner); });
    const addOtp = (otp, id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addOtp(otp, id); });
    const findOtpWithOwner = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.findOwnerOtp(ownerId);
    });
    const deleteOtpWithOwner = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteOwnerOtp(ownerId); });
    const updateOwnerverification = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateOwnerVerified(ownerId); });
    const registerGoogleOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.registerGoogleSignedOwner(owner); });
    const verifyAndResetPassword = (verificationCode, password) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findVerificationCodeAndUpdate(verificationCode, password); });
    const updateVerificationCode = (email, verificationCode) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateVerificationCode(email, verificationCode); });
    const getOwnerByNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getOwnerByNumber(phoneNumber); });
    const updateProfile = (ownerId, OwnerData) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateOwnerInfo(ownerId, OwnerData); });
    const getAllOwners = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllOwners(); });
    const updateOwnerBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateOwnerBlock(id, status); });
    return {
        getOwnerByEmail,
        addOwner,
        addOtp,
        findOtpWithOwner,
        deleteOtpWithOwner,
        updateOwnerverification,
        registerGoogleOwner,
        verifyAndResetPassword,
        updateVerificationCode,
        getOwnerById,
        updateProfile,
        getAllOwners,
        updateOwnerBlock,
        getOwnerByNumber,
    };
};
exports.ownerDbInterface = ownerDbInterface;
