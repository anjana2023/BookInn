export default function ownerEntity(
  name: string,
  email: string,
  phonenumber: string,
  password: string,
  role: string
) {
  return {
    getName: (): string => name,
    getEmail: (): string => email,
    getPhoneNumber: (): number => parseInt(phonenumber),
    getPassword: (): string => password,
    getOwnerRole: (): string => role,
  };
}

export type ownerEntityType = ReturnType<typeof ownerEntity>;

export function GoogleSignInOwnerEntity(
  name: string,
  email: string,
  picture: string,
  email_verified: boolean,
  role: string
) {
  return {
    name: (): string => name,
    email: (): string => email,
    picture: (): string => picture,
    email_verified: (): boolean => email_verified,
    getOwnerRole: (): string => role,
  };
}
export type GoogleOwnerEntityType = ReturnType<typeof GoogleSignInOwnerEntity>;
