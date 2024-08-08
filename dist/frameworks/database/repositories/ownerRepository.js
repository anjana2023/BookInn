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
exports.ownerDbRepository = void 0;
const ownerModel_1 = __importDefault(require("../models/ownerModel"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const ownerDbRepository = () => {
    const getOwnerEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const owner = yield ownerModel_1.default.findOne({ email });
        return owner;
    });
    const getOwnerbyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const owner = yield ownerModel_1.default.findById(id);
        return owner;
    });
    const addOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () {
        const newOwner = new ownerModel_1.default({
            name: owner.getName(),
            email: owner.getEmail(),
            phoneNumber: owner.getPhoneNumber(),
            password: owner.getPassword(),
            role: owner.getOwnerRole(),
        });
        newOwner.save();
        return newOwner;
    });
    const addOtp = (otp, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        yield otpModel_1.default.create({ otp, ownerId });
    });
    const findOwnerOtp = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield otpModel_1.default.findOne({ ownerId });
    });
    const deleteOwnerOtp = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.deleteOne({ ownerId }); });
    const updateOwnerVerified = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        yield ownerModel_1.default.findOneAndUpdate({ _id: ownerId }, { isVerified: true });
    });
    const registerGoogleSignedOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () {
        return yield ownerModel_1.default.create({
            name: owner.name(),
            email: owner.email(),
            profilePic: owner.picture(),
            isVerified: owner.email_verified(),
            role: owner.getOwnerRole(),
        });
    });
    const findVerificationCodeAndUpdate = (code, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield ownerModel_1.default.findOneAndUpdate({ verificationCode: code }, { password: newPassword, verificationCode: null }, { upsert: true });
    });
    const updateVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () { return yield ownerModel_1.default.findOneAndUpdate({ email }, { verificationCode: code }); });
    const updateOwnerInfo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () { return yield ownerModel_1.default.findByIdAndUpdate(id, updateData, { new: true }); });
    const getAllOwners = () => __awaiter(void 0, void 0, void 0, function* () {
        const own = yield ownerModel_1.default.find({ isVerified: true });
        return own;
    });
    const updateOwnerBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield ownerModel_1.default.findByIdAndUpdate(id, { isBlocked: status }); });
    const getOwnerByNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield ownerModel_1.default.findOne({ phoneNumber });
        return user;
    });
    return {
        getOwnerEmail,
        addOwner,
        addOtp,
        findOwnerOtp,
        deleteOwnerOtp,
        updateOwnerVerified,
        registerGoogleSignedOwner,
        findVerificationCodeAndUpdate,
        getOwnerbyId,
        updateVerificationCode,
        updateOwnerInfo,
        getOwnerByNumber,
        getAllOwners,
        updateOwnerBlock,
    };
};
exports.ownerDbRepository = ownerDbRepository;
