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
    findFriendId: (requestId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const friendRequest = yield db.friend.findUnique({
            where: {
                id: requestId,
                OR: [{ fromId: userId }, { toId: userId }],
            },
        });
        if (!friendRequest) {
            return null;
        }
        const friendId = friendRequest.fromId === userId ? friendRequest.toId : friendRequest.fromId;
        return friendId;
    }),
    findRequestById: (requestId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.friend.findUnique({
            where: {
                id: requestId,
                OR: [{ fromId: userId }, { toId: userId }],
            },
        });
    }),
    findPendingRequest: (fromId, toId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.friend.findFirst({
            where: {
                status: client_1.RequestStatus.PENDING,
                OR: [
                    { fromId: fromId, toId: toId },
                    { fromId: toId, toId: fromId },
                ],
            },
        });
    }),
    sendFriendRequest: (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.friend.create({
            data: {
                fromId: userId,
                toId: friendId,
                status: client_1.RequestStatus.PENDING,
            },
        });
    }),
    getAllReceivedRequests: function (userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db.friend.findMany({
                where: {
                    toId: userId,
                    status: client_1.RequestStatus.PENDING,
                },
            });
        });
    },
    getAllSentRequests: function (userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db.friend.findMany({
                where: {
                    fromId: userId,
                    status: client_1.RequestStatus.PENDING,
                },
            });
        });
    },
    acceptRequest: function (userId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const acceptedRequest = yield db.friend.findFirst({
                where: {
                    id: requestId,
                    toId: userId,
                    status: client_1.RequestStatus.PENDING,
                },
            });
            if (acceptedRequest) {
                yield db.friend.update({
                    where: { id: acceptedRequest.id, status: client_1.RequestStatus.PENDING },
                    data: { status: client_1.RequestStatus.ACCEPTED },
                });
            }
        });
    },
    rejectRequest: function (userId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rejectedRequest = yield db.friend.findFirst({
                where: {
                    id: requestId,
                    toId: userId,
                    status: client_1.RequestStatus.PENDING,
                },
            });
            if (rejectedRequest) {
                yield db.friend.delete({
                    where: {
                        id: rejectedRequest.id,
                    },
                });
            }
        });
    },
    cancelRequest: function (userId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const canceledRequest = yield db.friend.findFirst({
                where: {
                    id: requestId,
                    fromId: userId,
                    status: client_1.RequestStatus.PENDING,
                },
            });
            if (canceledRequest) {
                yield db.friend.delete({
                    where: {
                        id: canceledRequest.id,
                    },
                });
            }
        });
    },
};
