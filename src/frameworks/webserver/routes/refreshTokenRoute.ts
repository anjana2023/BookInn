import express from "express";
import { authService } from "../../servies/authService";
import tokenContoller from "../../../adapters/tokenController";
import { userDbRepository } from "../../../app/interfaces/userDbRepositories";
import { userRepositoryMongoDB } from "../../database/repositories/userRepositoryMongoDB";
import { authServiceInterface } from "../../../app/service-interface/authServices";
import { ownerDbInterface } from "../../../app/interfaces/ownerDbInterface";
import { ownerDbRepository } from "../../database/repositories/ownerRepository";

const refreshTokenRoute = () => {
  const router = express.Router();
  const controller = tokenContoller(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB,
    ownerDbInterface,
    ownerDbRepository,
  );

  console.log("inside the route controller .... ... .. . . .. ... ....")
  router.get("/accessToken", controller.returnAccessToClient);
  router.post("/refresh_token", controller.getNewAccessToken);

  return router;
};
export default refreshTokenRoute;