"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../../../adapters/authController"));
const authServices_1 = require("../../../app/service-interface/authServices");
const authService_1 = require("../../servies/authService");
const userDbRepositories_1 = require("../../../app/interfaces/userDbRepositories");
const profileController_1 = __importDefault(require("../../../adapters/profileController"));
const authMiddleWare_1 = __importDefault(require("../middleware/authMiddleWare"));
const hotelController_1 = __importDefault(require("../../../adapters/owner/hotelController"));
const hotelRepositoryMongoDB_1 = require("../../database/repositories/hotelRepositoryMongoDB");
const hotelDbInterface_1 = require("../../../app/interfaces/hotelDbInterface");
const bookingController_1 = __importDefault(require("../../../adapters/bookingController"));
const bookingDbInterface_1 = __importDefault(require("../../../app/interfaces/bookingDbInterface"));
const hotelServices_1 = require("../../../app/service-interface/hotelServices");
const bookingRepositoryMongoDB_1 = __importDefault(require("../../database/repositories/bookingRepositoryMongoDB"));
const hotelServices_2 = require("../../servies/hotelServices");
const userRepositoryMongoDB_1 = require("../../database/repositories/userRepositoryMongoDB");
const ownerRepository_1 = require("../../database/repositories/ownerRepository");
const ownerDbInterface_1 = require("../../../app/interfaces/ownerDbInterface");
const authRouter = () => {
    const router = express_1.default.Router();
    const controller = (0, authController_1.default)(authServices_1.authServiceInterface, authService_1.authService, userDbRepositories_1.userDbRepository, userRepositoryMongoDB_1.userRepositoryMongoDB, ownerDbInterface_1.ownerDbInterface, ownerRepository_1.ownerDbRepository);
    router.post("/auth/register", controller.registerUser);
    router.post("/auth/login", controller.userLogin);
    router.post("/auth/verifyOtp", controller.verifyOtp);
    router.post("/auth/resendOtp", controller.resendOtp);
    router.post("/auth/forgot-password", controller.forgotPassword);
    router.post("/auth/reset_password/:token", controller.resetPassword);
    router.post("/auth/googleSignIn", controller.GoogleSignIn);
    router.get("/OwnerDetails/:id", authMiddleWare_1.default, controller.OwnerDetail);
    const userProfileController = (0, profileController_1.default)(authServices_1.authServiceInterface, authService_1.authService, userDbRepositories_1.userDbRepository, userRepositoryMongoDB_1.userRepositoryMongoDB);
    router.get("/profile", authMiddleWare_1.default, userProfileController.userProfile);
    router.patch("/profile/edit", authMiddleWare_1.default, userProfileController.updateProfile);
    const userHotelController = (0, hotelController_1.default)(hotelDbInterface_1.hotelDbInterface, hotelRepositoryMongoDB_1.hotelDbRepository, bookingDbInterface_1.default, bookingRepositoryMongoDB_1.default);
    router.get("/hotels", userHotelController.getHotelsUserSide);
    router.get("/hotelDetails/:id", userHotelController.hotelDetails);
    router.post("/checkAvailability/:id", authMiddleWare_1.default, userHotelController.checkAvilabitiy);
    router.post("/addRating", authMiddleWare_1.default, userHotelController.addRating);
    router.get("/getRating/:hotelId", userHotelController.getRatingsbyHotelId);
    router.get("/getRatingById/:Id", userHotelController.getRatingsbyId);
    router.patch("/updateRatingById/:Id", userHotelController.updateRatingsbyId);
    const userBookingController = (0, bookingController_1.default)(bookingDbInterface_1.default, bookingRepositoryMongoDB_1.default, hotelDbInterface_1.hotelDbInterface, hotelRepositoryMongoDB_1.hotelDbRepository, hotelServices_1.hotelServiceInterface, hotelServices_2.hotelService, userDbRepositories_1.userDbRepository, userRepositoryMongoDB_1.userRepositoryMongoDB);
    router.post("/bookNow", authMiddleWare_1.default, userBookingController.handleBooking);
    router.patch("/payment_status/:id", authMiddleWare_1.default, userBookingController.updatePaymentStatus);
    router.get("/bookingdetails/:id", authMiddleWare_1.default, userBookingController.getBookingDetails);
    router.patch("/booking/cancel/:bookingID", authMiddleWare_1.default, userBookingController.cancelBooking);
    router.get("/allBookings", authMiddleWare_1.default, userBookingController.getAllBooking);
    router.get("/walletPayment", authMiddleWare_1.default, userBookingController.walletPayment);
    router.post("/addUnavilableDates", authMiddleWare_1.default, userBookingController.addUnavilableDate);
    //user side
    router.get("/fetchWallet/:id", authMiddleWare_1.default, userBookingController.getWallet);
    router.get("/transactions", authMiddleWare_1.default, userBookingController.getTransactions);
    router.get("/checkAvailability/:id", authMiddleWare_1.default, userHotelController.checkAvilabitiy);
    router.get("/searchedHotels", userHotelController.destinationSearch);
    router.get("/hotelDetails", userHotelController.DetailsFilter);
    return router;
};
exports.default = authRouter;
