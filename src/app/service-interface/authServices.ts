import { AuthServiceReturn } from "../../frameworks/servies/authService";
export const authServiceInterface = (service: AuthServiceReturn) => {
  const encryptPassword = async (password: string) =>
    service.encryptedPassword(password);

  const comparePassword = async (inputPassword: string, password: string) =>
    service.comparePassword(inputPassword, password);

  const generateOtp = () => service.generateOtp();

  const createTokens = (id: string, name: string, role: string) =>
    service.createTokens(id, name, role);

  const getRandomString = () => service.getRandomString();
  return {
    encryptPassword,
    comparePassword,
    generateOtp,
    createTokens,
    getRandomString,
  };
};
export type AuthServiceInterface = typeof authServiceInterface;
