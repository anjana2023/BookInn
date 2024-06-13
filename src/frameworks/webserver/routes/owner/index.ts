import express from "express";
import authController from "../../../../adapters/owner/ownerController";
import { ownerDbInterface } from "../../../../app/interfaces/ownerDbInterface";
import hotelController from "../../../../adapters/owner/hotelController";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { ownerDbRepository } from "../../../database/repositories/ownerRepository";
import { authService } from "../../../servies/authService";
import { authenticateOwner } from "../../middleware/authMiddleWare";
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";

const ownerRouter = () => {
  const router = express.Router();

  const controller = authController(
    authServiceInterface,
    authService,
    ownerDbInterface,
    ownerDbRepository,
    hotelDbInterface,
    hotelDbRepository
  );

const hotelcontrol=hotelController(hotelDbInterface,hotelDbRepository)

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
 
  router.get("/myHotels",authenticateOwner,hotelcontrol.registeredHotels)
  router.patch("/block_hotel/:id", hotelcontrol.hotelBlock);
  router.get("/hotelDetails/:id",controller.hotelDetails);
  router.patch("/hotelDetails/edit/:id",authenticateOwner,hotelcontrol.updateHotelInfo);


  return router;
};
export default ownerRouter;
