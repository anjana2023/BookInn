import { NextFunction, Request, Response } from "express";
import { AuthServiceInterface } from "../app/service-interface/authServices";
import { AuthService } from "../frameworks/servies/authService";

import {
  getUserProfile,
  updateUser,
  verifyNumber,
} from "../app/usecases/User/read&write/profile";
import { userDbInterface } from "../app/interfaces/userDbRepositories";
import { userRepositoryMongoDB } from "../frameworks/database/repositories/userRepositoryMongoDB";
import { HttpStatus } from "../types/httpStatus";

const profileController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user as string;
     
      const user = await getUserProfile(userId, dbRepositoryUser);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user as string;
      const updatedData = req.body;
   
      const user = await updateUser(userId, updatedData, dbRepositoryUser);
      res
        .status(200)
        .json({ success: true, user, message: "Profile updated successfully" });
    } catch (error) {
      console.log(error);

      next(error);
    }
  };
  const verifyPhoneNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { phone } = req.body;
    await verifyNumber(phone, dbRepositoryUser);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "otp is sended to your phone number",
    });
  };
  return {
    userProfile,
    updateProfile,
    verifyPhoneNumber,
  };
};
export default profileController;
