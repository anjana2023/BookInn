import express from "express";
import authController from "../../../adapters/authController";
import {
  AuthServiceInterface,
  authServiceInterface,
} from "../../../app/service-interface/authServices";
import { authService } from "../../servies/authService";
import { userDbRepository } from "../../../app/interfaces/userDbRepositories";
import { userRepositoryMongoDB } from "../../database/repositories/userRepositoryMongoDB";
import profileController from "../../../adapters/profileController";
import authenticateUser from "../middleware/authMiddleWare";
import hotelController from "../../../adapters/owner/hotelController";
import { hotelDbRepository } from "../../database/repositories/hotelRepositoryMongoDB";
import { hotelDbInterface } from "../../../app/interfaces/hotelDbInterface";

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






  return router;
};
export default authRouter;
