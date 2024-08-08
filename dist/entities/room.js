"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roomEntity;
function roomEntity(title, price, desc, maxChildren, maxAdults, roomNumbers) {
    return {
        getTitle: () => title,
        getPrice: () => price,
        getDescription: () => desc,
        getMaxChildren: () => maxChildren,
        getMaxAdults: () => maxAdults,
        getRoomNumbers: () => roomNumbers,
    };
}
