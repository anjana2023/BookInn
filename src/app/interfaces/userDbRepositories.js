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
exports.userDbRepository = void 0;
const userDbRepository = (repository) => {
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserEmail(email); });
    const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.getUserbyId(id);
        return user;
    });
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addUser(user); });
    const addOtp = (otp, id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addOtp(otp, id); });
    const findOtpWithUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findUserOtp(userId); });
    const deleteOtpWithUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteUserOtp(userId); });
    const updateUserverification = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserVerified(userId); });
    const getWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getWalletUser(userId); });
    const getTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield repository.getAllTransaction(userId);
        return response;
    });
    const getTransaction = (walletId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.allTransactions(walletId); });
    const addWallet = (userID) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addWallet(userID); });
    const registerGoogleoUser = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.registerGoogleSignedUser(user); });
    const verifyAndResetPassword = (verificationCode, password) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findVerificationCodeAndUpdate(verificationCode, password); });
    const updateVerificationCode = (email, verificationCode) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateVerificationCode(email, verificationCode); });
    const getUserByNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserByNumber(phoneNumber); });
    const updateProfile = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserInfo(userId, userData); });
    const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllUsers(); });
    const updateUserBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserBlock(id, status); });
    const updateWallet = (userId, newBalance) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateWallet(userId, newBalance); });
    const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.createTransaction(transactionDetails); });
    return {
        getUserByEmail,
        addUser,
        addOtp,
        findOtpWithUser,
        deleteOtpWithUser,
        updateUserverification,
        registerGoogleoUser,
        verifyAndResetPassword,
        updateVerificationCode,
        getUserById,
        updateProfile,
        getAllUsers,
        updateUserBlock,
        getUserByNumber,
        getWallet,
        createTransaction,
        updateWallet,
        getTransactions,
        addWallet,
        getTransaction
    };
};
exports.userDbRepository = userDbRepository;
