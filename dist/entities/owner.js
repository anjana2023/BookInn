"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ownerEntity;
exports.GoogleSignInOwnerEntity = GoogleSignInOwnerEntity;
function ownerEntity(name, email, phonenumber, password, role) {
    return {
        getName: () => name,
        getEmail: () => email,
        getPhoneNumber: () => parseInt(phonenumber),
        getPassword: () => password,
        getOwnerRole: () => role,
    };
}
function GoogleSignInOwnerEntity(name, email, picture, email_verified, role) {
    return {
        name: () => name,
        email: () => email,
        picture: () => picture,
        email_verified: () => email_verified,
        getOwnerRole: () => role,
    };
}
