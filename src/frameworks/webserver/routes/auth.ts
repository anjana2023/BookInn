import express from "express";
import authController from "../../../adapters/authController";
import {
  AuthServiceInterface,
  authServiceInterface,
} from "../../../app/service-interface/authServices";
import { authService } from "../../servies/authService";
import { userDbRepository } from "../../../app/interfaces/userDbRepositories";
import profileController from "../../../adapters/profileController";
import authenticateUser from "../middleware/authMiddleWare";
import hotelController from "../../../adapters/owner/hotelController";
import { hotelDbRepository } from "../../database/repositories/hotelRepositoryMongoDB";
import { hotelDbInterface } from "../../../app/interfaces/hotelDbInterface";
import bookingController from "../../../adapters/bookingController";
import bookingDbInterface from "../../../app/interfaces/bookingDbInterface";
import { hotelServiceInterface } from "../../../app/service-interface/hotelServices";
import bookingDbRepository from "../../database/repositories/bookingRepositoryMongoDB";
import { hotelService } from "../../servies/hotelServices";
import {userRepositoryMongoDB } from "../../database/repositories/userRepositoryMongoDB"
import { ownerDbRepository } from "../../database/repositories/ownerRepository";
import { ownerDbInterface } from "../../../app/interfaces/ownerDbInterface";

const authRouter = () => {
  const router = express.Router();
  const controller = authController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB,
    ownerDbInterface,
    ownerDbRepository,
   
  );

  router.post("/auth/register", controller.registerUser);
  router.post("/auth/login", controller.userLogin);
  router.post("/auth/verifyOtp", controller.verifyOtp);
  router.post("/auth/resendOtp", controller.resendOtp);
  router.post("/auth/forgot-password", controller.forgotPassword);
  router.post("/auth/reset_password/:token", controller.resetPassword);
  router.post("/auth/googleSignIn", controller.GoogleSignIn);
  router.get("/OwnerDetails/:id",authenticateUser,controller.OwnerDetail);


  const userProfileController = profileController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB
  );

  router.get("/profile", authenticateUser, userProfileController.userProfile);

  router.patch(
    "/profile/edit",
    authenticateUser,
    userProfileController.updateProfile
  );

  const userHotelController = hotelController(
    hotelDbInterface,
    hotelDbRepository,
    bookingDbInterface,
    bookingDbRepository,
  );
  router.get("/hotels",userHotelController.getHotelsUserSide);
  router.get("/hotelDetails/:id",userHotelController.hotelDetails);
  router.post("/checkAvailability/:id",authenticateUser, userHotelController.checkAvilabitiy);
  router.post("/addRating", authenticateUser, userHotelController.addRating)
  router.get("/getRating/:hotelId", userHotelController.getRatingsbyHotelId)
  router.get("/getRatingById/:Id", userHotelController.getRatingsbyId)
  router.patch("/updateRatingById/:Id", userHotelController.updateRatingsbyId)

 

  const userBookingController = bookingController(
    bookingDbInterface,
    bookingDbRepository,
    hotelDbInterface,
    hotelDbRepository,
    hotelServiceInterface,
    hotelService,
    userDbRepository,
    userRepositoryMongoDB
   );
 
   router.post("/bookNow",authenticateUser,userBookingController.handleBooking)
   router.patch("/payment_status/:id",authenticateUser,userBookingController.updatePaymentStatus);
   router.get("/bookingdetails/:id",authenticateUser,userBookingController.getBookingDetails);
   router.patch("/booking/cancel/:bookingID",authenticateUser,userBookingController.cancelBooking)
   router.get("/allBookings",authenticateUser,userBookingController.getAllBooking);
  router.get("/walletPayment",authenticateUser,userBookingController.walletPayment);
  router.post(
    "/addUnavilableDates",
    authenticateUser,
    userBookingController.addUnavilableDate
  )
  //user side
  router.get("/fetchWallet/:id",authenticateUser,userBookingController.getWallet);
  router.get("/transactions", authenticateUser, userBookingController.getTransactions);
  router.get("/checkAvailability/:id",authenticateUser, userHotelController.checkAvilabitiy);
  router.get("/searchedHotels", userHotelController.destinationSearch)
  router.get("/hotelDetails", userHotelController.DetailsFilter)
  return router;
};
export default authRouter;
