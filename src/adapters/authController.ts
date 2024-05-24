import asyncHandler from "express-async-handler";

import { userRepositoryMongoDB } from "./../frameworks/database/repositories/userRepositoryMongoDB";

import { Request, Response, NextFunction } from "express";

import { userDbInterface } from "./../app/interfaces/userDbRepositories";

import { CreateUserInterface, UserInterface } from "../types/userInterfaces";

import { AuthServiceInterface } from "../app/service-interface/authServices";

import { AuthService } from "../frameworks/servies/authService";

import {
  authenticateGoogleUser,
  deleteOtp,
  loginUser,
  sendResetVerificationCode,
  userRegister,
  verifyOtpUser,
  verifyTokenResetPassword,
} from "../app/usecases/User/auth/userAuth";

import { HttpStatus } from "../types/httpStatus";
import { GoogleResponseType } from "../types/GoogleResponseTypes";

const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user: CreateUserInterface = req.body;
        const newUser = await userRegister(user, dbRepositoryUser, authService);
        res.json({
          status: "success",
          message: "otp is sended to the email",
          newUser,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("asdfghjkjhgfdsdfgh");
      const { otp, userid } = req.body;
      const isVerified = await verifyOtpUser(otp, userid, dbRepositoryUser);
      if (isVerified) {
        return res
          .status(HttpStatus.OK)
          .json({ message: "User account is verified, please login" });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Invalid OTP, please try again" });
      }
    } catch (error) {
      next(error);
    }
  };

  const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      console.log(userId);
      console.log(userId);
      await deleteOtp(userId, dbRepositoryUser, authService);
      res.json({ message: "New otp sent to mail" });
    } catch (error) {
      next(error);
    }
  };

  const userLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("Request Body:", req.body);
        const { accessToken, isEmailExist } = await loginUser(
          req.body,
          dbRepositoryUser,
          authService
        );

        res.json({
          status: "success",
          message: "user logined",
          accessToken,
          user: isEmailExist,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  const GoogleSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: GoogleResponseType = req.body;
      const { accessToken, isEmailExist, newUser } =
        await authenticateGoogleUser(userData, dbRepositoryUser, authService);
      const user = isEmailExist ? isEmailExist : newUser;
      res
        .status(HttpStatus.OK)
        .json({ message: "login success", user, accessToken });
    } catch (error) {
      next(error);
    }
  };

  const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      await sendResetVerificationCode(email, dbRepositoryUser, authService);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Reset password code sent to your mail",
      });
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      await verifyTokenResetPassword(
        token,
        password,
        dbRepositoryUser,
        authService
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Reset password success,you can login with your new password",
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    registerUser,
    userLogin,
    verifyOtp,
    GoogleSignIn,
    resetPassword,
    resendOtp,
    forgotPassword,
  };
};
export default authController;
