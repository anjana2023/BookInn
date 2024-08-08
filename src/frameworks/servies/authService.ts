import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import configKeys from "../../config";
import crypto from "crypto";

export const authService = () => {
  const encryptedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
  };

  const comparePassword = async (inputPassword: string, password: string) => {
    return await bcrypt.compare(inputPassword, password);
  };

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return `${otp}`;
  };

  const createTokens = (id: string, name: string, role: string) => {
    const payload = {
      id,
      name,
      role,
    };
    const accessToken = jwt.sign(payload, configKeys.ACCESS_SECRET, {
      expiresIn: "2d",
    });

    const refreshToken = jwt.sign(payload,configKeys.REFRESH_SECRET,{
      expiresIn:"2d",
  });
  
  return {accessToken, refreshToken};
  };



  const OwnerCreateTokens = (id:string,name:string, role:string)=>{
    const payload = {
        id,
        name,
        role,
    };
    const accessToken = jwt.sign(payload, configKeys.ACCESS_SECRET, {
        expiresIn: "2d",
      });
      const refreshToken = jwt.sign(payload, configKeys.REFRESH_SECRET, {
        expiresIn: "2d",
      });
   
    
    return {accessToken,refreshToken};
}
  const getRandomString = () => crypto.randomUUID();

  return {
    encryptedPassword,
    comparePassword,
    generateOtp,
    createTokens,
    getRandomString,
    OwnerCreateTokens
  };
};
export type AuthService = typeof authService;
export type AuthServiceReturn = ReturnType<AuthService>;
