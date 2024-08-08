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
exports.blockOwner = exports.blockUser = void 0;
const blockUser = (id, userDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userDbRepository.getUserById(id);
    yield userDbRepository.updateUserBlock(id, !(user === null || user === void 0 ? void 0 : user.isBlocked));
});
exports.blockUser = blockUser;
const blockOwner = (id, ownerDbInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield ownerDbInterface.getOwnerById(id);
    yield ownerDbInterface.updateOwnerBlock(id, !(owner === null || owner === void 0 ? void 0 : owner.isBlocked));
});
exports.blockOwner = blockOwner;
