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
import { ownerDbInterfaceType } from "../app/interfaces/ownerDbInterface";
import { ownerDbRepositoryType } from "../frameworks/database/repositories/ownerRepository";
import { getSingleOwner } from "../app/usecases/owner/auth/ownerAuth";

const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongoDB,
  ownerDbRepository: ownerDbInterfaceType,
  ownerDbRepositoryImpl: ownerDbRepositoryType,
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());
  const dbRepositoryOwner = ownerDbRepository(ownerDbRepositoryImpl());
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
      
      await deleteOtp(userId, dbRepositoryUser, authService);
      res.json({ message: "New otp sent to mail" });
    } catch (error) {
      next(error);
    }
  };

  const userLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
     
        const { accessToken,refreshToken, isEmailExist } = await loginUser(
          req.body,
          dbRepositoryUser,
          authService
        );

        res.json({
          status: "success",
          message: "user logined",
          access_token: accessToken,
          refresh_token: refreshToken,
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
      const { accessToken,refreshToken ,isEmailExist, newUser } =
        await authenticateGoogleUser(userData, dbRepositoryUser, authService);
      const user = isEmailExist ? isEmailExist : newUser;
      res
        .status(HttpStatus.OK)
        .json({ message: "login success", user,  access_token: accessToken,
          refresh_token: refreshToken 
        });
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


  const OwnerDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {  
     

      const id = req.params.id
     
      const Hotel = await getSingleOwner(id, dbRepositoryOwner)
      
      if (!Hotel) {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false, error: "Hotel not found" });
      }
      
      return res.status(HttpStatus.OK).json({ success: true, Hotel })
    } catch (error) {
      next(error)
    }
  }

  return {
    registerUser,
    userLogin,
    verifyOtp,
    GoogleSignIn,
    resetPassword,
    resendOtp,
    forgotPassword,
    OwnerDetail,
  };
};
export default authController;
