import express from "express";
import authController from "../../../../adapters/owner/ownerController";
import { ownerDbInterface } from "../../../../app/interfaces/ownerDbInterface";
import hotelController from "../../../../adapters/owner/hotelController";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { ownerDbRepository } from "../../../database/repositories/ownerRepository";
import { authService } from "../../../servies/authService";
import authenticateUser, { authenticateOwner } from "../../middleware/authMiddleWare";
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
import bookingController from "../../../../adapters/bookingController";
import bookingDbInterface from "../../../../app/interfaces/bookingDbInterface";
import { userDbRepository } from "../../../../app/interfaces/userDbRepositories";
import { hotelServiceInterface } from "../../../../app/service-interface/hotelServices";
import bookingDbRepository from "../../../database/repositories/bookingRepositoryMongoDB";
import { userRepositoryMongoDB } from "../../../database/repositories/userRepositoryMongoDB";
import { hotelService } from "../../../servies/hotelServices";

const ownerRouter = () => {
  const router = express.Router();

  const controller = authController(
    authServiceInterface,
    authService,
    ownerDbInterface,
    ownerDbRepository,
    hotelDbInterface,
    hotelDbRepository,
    userDbRepository,
    userRepositoryMongoDB
  );

const hotelcontrol=hotelController(
  hotelDbInterface,
  hotelDbRepository,
   bookingDbInterface,
  bookingDbRepository,
)

  router.post("/auth/register", controller.registerOwner);
  router.post("/auth/login", controller.ownerLogin);
  router.post("/auth/verifyOtp", controller.verifyOtp);
  router.post("/auth/resendOtp", controller.resendOtp);
  router.post("/auth/forgot-password", controller.forgotPassword);

  router.post("/auth/reset_password/:token", controller.resetPassword);
  router.post("/auth/googleSignIn", controller.GoogleSignIn);
  router.get("/profile", authenticateOwner, controller.ownerProfile);
  router.patch("/profile/edit", authenticateOwner, controller.updateProfile);
  // router.post("/auth/verify", controller.verifyPhoneNumber);

  router.post("/addhotel",authenticateOwner,hotelcontrol.registerHotel)
  router.post("/addRoom/:id",authenticateOwner, hotelcontrol.registerRoom);
  router.put("/reapply_verification/:id",authenticateOwner,hotelcontrol.getHotelRejected)
  router.get("/myHotels",authenticateOwner,hotelcontrol.registeredHotels)
  router.patch("/block_hotel/:id", hotelcontrol.hotelBlock);
  router.get("/bookings",authenticateOwner,hotelcontrol.getOwnerBookings)

    router.patch("/user/:id", controller.getUser)
  router.get("/user/:id", controller.getUserById)
  router.get("/hotelDetails/:id",controller.hotelDetails);
  router.patch("/editHotel/:id",authenticateOwner,hotelcontrol.updateHotelInfo);


    const ownerBookingController = bookingController(
      bookingDbInterface,
      bookingDbRepository,
      hotelDbInterface,
      hotelDbRepository,
      hotelServiceInterface,
      hotelService,
      userDbRepository,
      userRepositoryMongoDB
   );
   router.get("/bookings",authenticateOwner,ownerBookingController.getOwnerBookings)


  return router;
};
export default ownerRouter;
