export interface CreateOwnerInterface {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}
export interface OwnerInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phoneNumber: string;
  role: string;
  wallet?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
}
