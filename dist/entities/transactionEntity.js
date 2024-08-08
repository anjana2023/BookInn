"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transactionEntity;
function transactionEntity(walletId, amount, type, description) {
    return {
        getWalletId: () => walletId,
        getAmount: () => amount,
        getType: () => type,
        getDescription: () => description,
    };
}
