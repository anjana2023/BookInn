"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyNumber = exports.updateOwner = exports.getOwnerProfile = void 0;
const getOwnerProfile = (userID, ownerRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield ownerRepository.getOwnerById(userID);
    return user;
});
exports.getOwnerProfile = getOwnerProfile;
const updateOwner = (userID, updateData, ownerRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield ownerRepository.updateProfile(userID, updateData); });
exports.updateOwner = updateOwner;
const verifyNumber = (phoneNumber, ownerRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield ownerRepository.getOwnerByNumber(phoneNumber);
});
exports.verifyNumber = verifyNumber;
