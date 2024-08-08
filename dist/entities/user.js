"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userEntity;
exports.GoogleSignInUserEntity = GoogleSignInUserEntity;
function userEntity(name, email, phonenumber, password, role, authenticationMethod) {
    return {
        getName: () => name,
        getEmail: () => email,
        getPhoneNumber: () => parseInt(phonenumber),
        getPassword: () => password,
        getUserRole: () => role,
        getAuthenticationMethod: () => authenticationMethod,
    };
}
function GoogleSignInUserEntity(name, email, picture, email_verified, role, authenticationMethod) {
    return {
        name: () => name,
        email: () => email,
        picture: () => picture,
        email_verified: () => email_verified,
        getUserRole: () => role,
        authenticationMethod: () => authenticationMethod,
    };
}
