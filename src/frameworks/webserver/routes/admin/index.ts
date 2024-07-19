import { Router } from "express";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { authService } from "../../../servies/authService";
import { userDbRepository } from "../../../../app/interfaces/userDbRepositories";
import { ownerDbInterface } from "../../../../app/interfaces/ownerDbInterface";
import { ownerDbRepository } from "../../../database/repositories/ownerRepository";
import { userRepositoryMongoDB } from "../../../database/repositories/userRepositoryMongoDB";
import adminController from "../../../../adapters/admin/adminController";
import { authenticateAdmin } from "../../middleware/authMiddleWare";
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";


const adminRouter = () => {
  const router = Router();
  const controller = adminController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB,
    ownerDbInterface,
    ownerDbRepository,
    hotelDbInterface,
    hotelDbRepository
  );
  router.post("/login", controller.adminLogin);
  router.get("/users", authenticateAdmin, controller.getAllUsers);
  router.get("/owners", authenticateAdmin, controller.getAllOwners);
  router.get("/hotels",controller.getAllHotels)
  router.get("/hotelDetails/:id",controller.hotelDetails);
  router.get("/bookings",authenticateAdmin, controller.getAllBookings);

  router.patch("/block_user/:id", controller.userBlock);
  router.patch("/block_owner/:id",  controller.ownerBlock);
  router.patch("/verify_hotel/:id", controller.VerifyHotel);
  router.patch("/verify_hotel_rejection/:id",controller.rejectionHotel);
  router.post("/addCategory",controller.addCategory);

  return router;
};
export default adminRouter;
