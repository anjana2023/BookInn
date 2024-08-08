"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSignInOwnerEntity = void 0;
function ownerEntity(name, email, phonenumber, password, role) {
    return {
        getName: () => name,
        getEmail: () => email,
        getPhoneNumber: () => parseInt(phonenumber),
        getPassword: () => password,
        getOwnerRole: () => role,
    };
}
exports.default = ownerEntity;
function GoogleSignInOwnerEntity(name, email, picture, email_verified, role) {
    return {
        name: () => name,
        email: () => email,
        picture: () => picture,
        email_verified: () => email_verified,
        getOwnerRole: () => role,
    };
}
exports.GoogleSignInOwnerEntity = GoogleSignInOwnerEntity;
