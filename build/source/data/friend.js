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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../clients/database"));
const db = database_1.default.instance;
exports.default = {
    areFriends: (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.friend.findFirst({
            where: {
                OR: [
                    { fromId: userId, toId: friendId },
                    { fromId: friendId, toId: userId },
                ],
                status: client_1.RequestStatus.ACCEPTED,
            },
        });
    }),
    getAllFriends: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.friend.findMany({
            where: {
                OR: [
                    {
                        fromId: userId,
                        status: client_1.RequestStatus.ACCEPTED,
                    },
                    {
                        toId: userId,
                        status: client_1.RequestStatus.ACCEPTED,
                    },
                ],
            },
        });
    }),
    deleteFriend: (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.friend.deleteMany({
            where: {
                OR: [
                    { fromId: userId, toId: friendId },
                    { fromId: friendId, toId: userId },
                ],
            },
        });
    }),
};
