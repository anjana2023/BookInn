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

const authRouter = () => {
  const router = express.Router();
  const controller = authController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB
  );

  router.post("/auth/register", controller.registerUser);
  router.post("/auth/login", controller.userLogin);
  router.post("/auth/verifyOtp", controller.verifyOtp);
  router.post("/auth/resendOtp", controller.resendOtp);
  router.post("/auth/forgot-password", controller.forgotPassword);

  router.post("/auth/reset_password/:token", controller.resetPassword);
  router.post("/auth/googleSignIn", controller.GoogleSignIn);

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
  // router.post("/auth/verify", userProfileController.verifyPhoneNumber);


  const userHotelController = hotelController(
    hotelDbInterface,
    hotelDbRepository
  );
  router.get("/hotels", authenticateUser, userHotelController.getHotelsUserSide);
  router.get("/hotelDetails/:id",userHotelController.hotelDetails);
  router.get("/checkAvailability/:id", userHotelController.checkAvilabitiy);


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
   router.patch("/payment_status/:id",userBookingController.updatePaymentStatus);
   router.get("/bookingdetails/:id",userBookingController.getBookingDetails);
   router.get("/allBookings",authenticateUser,userBookingController.getAllBooking);
  //  router.get("/bookings/:id",authenticateUser,userBookingController.getAllBookingDetails);




  return router;
};
export default authRouter;
