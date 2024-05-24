export interface CreateUserInterface {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  authenticationMethod: string;
}
export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  authenticationMethod: string;
  profilePic?: string;
  phoneNumber: string;
  role: string;
  wallet?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
}
