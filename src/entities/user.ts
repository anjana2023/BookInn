export default function userEntity(
  name: string,
  email: string,
  phonenumber: string,
  password: string,
  role: string,
  authenticationMethod: string
) {
  return {
    getName: (): string => name,
    getEmail: (): string => email,
    getPhoneNumber: (): number => parseInt(phonenumber),
    getPassword: (): string => password,
    getUserRole: (): string => role,
    getAuthenticationMethod: (): string => authenticationMethod,
  };
}

export type userEntityType = ReturnType<typeof userEntity>;

export function GoogleSignInUserEntity(
  name: string,
  email: string,
  picture: string,
  email_verified: boolean,
  role: string,
  authenticationMethod: string
) {
  return {
    name: (): string => name,
    email: (): string => email,
    picture: (): string => picture,
    email_verified: (): boolean => email_verified,
    getUserRole: (): string => role,
    authenticationMethod: (): string => authenticationMethod,
  };
}
export type GoogleUserEntityType = ReturnType<typeof GoogleSignInUserEntity>;
