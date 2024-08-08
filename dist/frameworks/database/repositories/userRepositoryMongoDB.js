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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryMongoDB = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const wallet_1 = __importDefault(require("../models/wallet"));
const transaction_1 = __importDefault(require("../models/transaction"));
const transaction_2 = __importDefault(require("../models/transaction"));
const userRepositoryMongoDB = () => {
    const getUserEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ email });
        return user;
    });
    const getUserbyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findById(id).populate("wallet").lean();
        if (!user) {
            return null;
        }
        const { _id } = user, rest = __rest(user, ["_id"]);
        return Object.assign({ id: _id.toString() }, rest);
    });
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = new userModel_1.default({
            name: user.getName(),
            email: user.getEmail(),
            phoneNumber: user.getPhoneNumber(),
            password: user.getPassword(),
            authenticationMethod: user.getAuthenticationMethod(),
        });
        newUser.save();
        return newUser;
    });
    const addOtp = (otp, userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield otpModel_1.default.create({ otp, userId });
    });
    const findUserOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.findOne({ userId }); });
    const deleteUserOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.deleteOne({ userId }); });
    const updateUserVerified = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel_1.default.findOneAndUpdate({ _id: userId }, { isVerified: true, wallet: wallet_1.default });
    });
    const registerGoogleSignedUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.create({
            name: user.name(),
            email: user.email(),
            profilePic: user.picture(),
            isVerified: user.email_verified(),
            authenticationMethod: user.authenticationMethod(),
        });
    });
    const findVerificationCodeAndUpdate = (code, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.findOneAndUpdate({ verificationCode: code }, { password: newPassword, verificationCode: null }, { upsert: true });
    });
    const updateVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.findOneAndUpdate({ email }, { verificationCode: code }); });
    const updateUserInfo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.findByIdAndUpdate(id, updateData, { new: true }); });
    const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.find({ isVerified: true }); });
    const updateUserBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.findByIdAndUpdate(id, { isBlocked: status }); });
    const getUserByNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ phoneNumber });
        return user;
    });
    const getWalletUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield wallet_1.default.findOne({ userId: userId });
    });
    const updateWallet = (userId, newBalance) => __awaiter(void 0, void 0, void 0, function* () { return yield wallet_1.default.findOneAndUpdate({ userId }, { $inc: { balance: newBalance } }, { new: true }); });
    const addWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield wallet_1.default.create({ userId }); });
    const getAllTransaction = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield transaction_1.default.find({ userId: userId });
        return transactions;
    });
    const allTransactions = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield transaction_2.default
            .find({ walletId })
            .sort({ createdAt: -1 })
            .populate("walletId");
    });
    const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () {
        return yield transaction_2.default.create({
            walletId: transactionDetails.getWalletId(),
            type: transactionDetails.getType(),
            description: transactionDetails.getDescription(),
            amount: transactionDetails.getAmount(),
        });
    });
    return {
        getUserEmail,
        addUser,
        addOtp,
        findUserOtp,
        deleteUserOtp,
        updateUserVerified,
        registerGoogleSignedUser,
        findVerificationCodeAndUpdate,
        updateVerificationCode,
        getUserbyId,
        updateUserInfo,
        createTransaction,
        getAllUsers,
        updateUserBlock,
        getUserByNumber,
        getWalletUser,
        getAllTransaction,
        addWallet,
        allTransactions,
        updateWallet
    };
};
exports.userRepositoryMongoDB = userRepositoryMongoDB;
