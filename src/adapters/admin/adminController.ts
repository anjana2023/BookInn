import { NextFunction, Request, Response } from "express";

import { AuthServiceInterface } from "../../app/service-interface/authServices";

import { AuthService } from "../../frameworks/servies/authService";
import { HttpStatus } from "../../types/httpStatus";
import { loginAdmin } from "../../app/usecases/admin/auth/adminAuth";
import { userDbInterface } from "../../app/interfaces/userDbRepositories";
import {
  ownerDbInterface,
  ownerDbInterfaceType,
} from "../../app/interfaces/ownerDbInterface";
import { ownerDbRepositoryType } from "../../frameworks/database/repositories/ownerRepository";
import { userRepositoryMongoDB } from "../../frameworks/database/repositories/userRepositoryMongoDB";
import { getOwners, getUsers } from "../../app/usecases/admin/adminRead";
import { blockOwner, blockUser } from "../../app/usecases/admin/adminUpdate";
import { getHotel, getHotelRejected, getHotels } from "../../app/usecases/owner/hotel";
import { hotelDbInterface, hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";
import { hotelDbRepository, hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { getHotelDetails } from "../../app/usecases/User/read&write/hotel";



const adminController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongoDB,
  ownerDbRepository: ownerDbInterfaceType,
  ownerDbRepositoryImpl: ownerDbRepositoryType,
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const authService = authServiceInterface(authServiceImpl());
  const dbUserRepository = userDbRepository(userDbRepositoryImpl());
  const dbOwnerRepository = ownerDbRepository(ownerDbRepositoryImpl());
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());

  const adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const accessToken = await loginAdmin(email, password, authService);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Admin login success",
        admin: {
          name: "Admin_User",
          role: "admin",
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await getUsers(dbUserRepository);
      return res.status(HttpStatus.OK).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };

  const getAllOwners = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await getOwners(dbOwnerRepository);
      return res.status(HttpStatus.OK).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };

  const userBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await blockUser(id, dbUserRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "User blocked Successfully" });
    } catch (error) {
      next(error);
    }
  };

  const ownerBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await blockOwner(id, dbOwnerRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Vendor blocked Successfully" });
    } catch (error) {
      next(error);
    }
  };

  const getAllHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const Hotels = await getHotels(dbRepositoryHotel);
      return res.status(HttpStatus.OK).json({ success: true, Hotels });
    } catch (error) {
      next(error);
    }
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

/* method patch verify in admin */
const VerifyHotel = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const {id} = req.params;
    const {status} = req.body;
    const doctor = await getHotel(id,status,dbRepositoryHotel);
    return res.status(HttpStatus.OK).json({ success: true, doctor,message:"Verified Successfully" });
  } catch (error) {
    next(error);
  }
}


/* method patch rejection in admin */
const rejectionHotel = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const {id} = req.params;
    const {status} = req.body;
    const {reason} = req.body;
    const doctor = await getHotelRejected(id,status,reason,dbRepositoryHotel);
    return res.status(HttpStatus.OK).json({ success: true, doctor,message:"Verified Successfully" });
  } catch (error) {
    next(error);
  }
}




  return {
    adminLogin,
    getAllUsers,
    getAllOwners,
    userBlock,
    ownerBlock,
    getAllHotels,
    hotelDetails,
    VerifyHotel,
    rejectionHotel
  };
};

export default adminController;
