import asyncHandler from "express-async-handler";

import {
  ownerDbRepository,
  ownerDbRepositoryType,
} from "../../frameworks/database/repositories/ownerRepository";

import { Request, Response, NextFunction } from "express";
import { getHotelDetails } from "../../app/usecases/User/read&write/hotel";
import { hotelDbInterface, hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";

import {
  ownerDbInterface,
  ownerDbInterfaceType,
} from "../../app/interfaces/ownerDbInterface";

import {
  CreateOwnerInterface,
  OwnerInterface,
} from "../../types/ownerInterfaces";

import { AuthServiceInterface } from "../../app/service-interface/authServices";
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { AuthService } from "../../frameworks/servies/authService";
import {
  OwnerRegister,
  authenticateGoogleOwner,
  deleteOtp,
  loginOwner,
  sendResetVerificationCode,
  verifyOtpOwner,
  verifyTokenResetPassword,
} from "../../app/usecases/owner/auth/ownerAuth";
import { HttpStatus } from "../../types/httpStatus";

import { GoogleResponseType } from "../../types/GoogleResponseTypes";
import {
  getOwnerProfile,
  updateOwner,
  verifyNumber,
} from "../../app/usecases/owner/auth/read&write/ownerProfile";

const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  ownerDbRepository: ownerDbInterfaceType,
  ownerDbRepositoryImpl: ownerDbRepositoryType,
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const dbRepositoryOwner = ownerDbRepository(ownerDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
  const registerOwner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const owner: CreateOwnerInterface = req.body;
        console.log(
          req.body,
          "------------------------------------------------------------------ register"
        );
        const newOwner = await OwnerRegister(
          owner,
          dbRepositoryOwner,
          authService
        );
        res.json({
          status: "success",
          message: "otp is sended to the email",
          newOwner,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, ownerid } = req.body;

      const isVerified = await verifyOtpOwner(otp, ownerid, dbRepositoryOwner);
      if (isVerified) {
        return res
          .status(HttpStatus.OK)
          .json({ message: "Owner account is verified, please login" });
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
      const { ownerId } = req.body;
      console.log(ownerId);
      console.log(ownerId);
      await deleteOtp(ownerId, dbRepositoryOwner, authService);
      res.json({ message: "New otp sent to mail" });
    } catch (error) {
      next(error);
    }
  };

  const ownerLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("Request Body:", req.body);
        const { accessToken, isEmailExist } = await loginOwner(
          req.body,
          dbRepositoryOwner,
          authService
        );

        res.json({
          status: "success",
          message: "owner logined",
          accessToken,
          owner: isEmailExist,
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
      const ownerData: GoogleResponseType = req.body;
      const { accessToken, isEmailExist, newOwner } =
        await authenticateGoogleOwner(
          ownerData,
          dbRepositoryOwner,
          authService
        );
      const owner = isEmailExist ? isEmailExist : newOwner;
      res
        .status(HttpStatus.OK)
        .json({ message: "login success", owner, accessToken });
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
      await sendResetVerificationCode(email, dbRepositoryOwner, authService);
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
      console.log(token);
      await verifyTokenResetPassword(
        token,
        password,
        dbRepositoryOwner,
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

  const ownerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).owner as string;
      console.log(userId);
      const user = await getOwnerProfile(userId, dbRepositoryOwner);
      console.log(user, "owner profile");
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
      const userId = (req as any).owner as string;
      const updatedData = req.body;
      const user = await updateOwner(userId, updatedData, dbRepositoryOwner);
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
    await verifyNumber(phone, dbRepositoryOwner);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "otp is sended to your phone number",
    });
  };


  const hotelDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {      
      const id = req.params.id
      console.log(id);
      
      const Hotel = await getHotelDetails(id, dbRepositoryHotel)
      console.log(Hotel);
      return res.status(HttpStatus.OK).json({ success: true, Hotel })
    } catch (error) {
      next(error)
    }
  }



  return {
    registerOwner,
    ownerLogin,
    verifyOtp,
    GoogleSignIn,
    resetPassword,
    resendOtp,
    forgotPassword,
    verifyPhoneNumber,
    updateProfile,
    ownerProfile,
    hotelDetails
  };
};

export default authController;
