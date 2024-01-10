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
exports.NTF_USER_REJECT_FRIEND_EVENT = exports.NTF_USER_ACCEPT_FRIEND_EVENT = exports.NTF_USER_SEND_FRIEND_EVENT = void 0;
const database_1 = __importDefault(require("../clients/database"));
const redis_1 = __importDefault(require("../clients/redis"));
const db = database_1.default.instance;
const redis = redis_1.default.instance;
exports.NTF_USER_SEND_FRIEND_EVENT = "ntfSendFriend";
exports.NTF_USER_ACCEPT_FRIEND_EVENT = "ntfAcceptFriend";
exports.NTF_USER_REJECT_FRIEND_EVENT = "ntfRejectFriend";
exports.default = {
    getUserNotifications: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.notification.findMany({
            where: {
                recipients: {
                    some: {
                        id: userId,
                    },
                },
            },
        });
    }),
    sendFriendRequestNtf: (userId, friendId, io) => __awaiter(void 0, void 0, void 0, function* () {
        const content = `${userId} подал заявку в друзья`;
        const notification = {
            type: "sendFriendRequest",
            content,
            read: false,
            recipients: { connect: [{ id: friendId }] },
        };
        const createdNotification = yield db.notification.create({ data: notification });
        const friendSocketId = yield redis.hget("userSockets", `userId: ${friendId}`);
        if (friendSocketId) {
            io.to(friendSocketId).emit(exports.NTF_USER_SEND_FRIEND_EVENT, {
                friendId: userId,
                notificationId: createdNotification.id,
            });
        }
        return createdNotification;
    }),
    sendAcceptRequestNtf: (userId, friendId, io) => __awaiter(void 0, void 0, void 0, function* () {
        const content = `${userId} принял заявку в друзья`;
        const notification = {
            type: "acceptFriendRequest",
            content,
            read: false,
            recipients: { connect: [{ id: friendId }] },
        };
        const createdNotification = yield db.notification.create({ data: notification });
        const friendSocketId = yield redis.hget("userSockets", `userId: ${friendId}`);
        if (friendSocketId) {
            io.to(friendSocketId).emit(exports.NTF_USER_ACCEPT_FRIEND_EVENT, {
                friendId: userId,
                notificationId: createdNotification.id,
            });
        }
        return createdNotification;
    }),
    sendRejectRequestNtf: (userId, friendId, io) => __awaiter(void 0, void 0, void 0, function* () {
        const content = `${userId} отклонил заявку в друзья`;
        const notification = {
            type: "rejectFriendRequest",
            content,
            read: false,
            recipients: { connect: [{ id: friendId }] },
        };
        const createdNotification = yield db.notification.create({ data: notification });
        const friendSocketId = yield redis.hget("userSockets", `userId: ${friendId}`);
        if (friendSocketId) {
            io.to(friendSocketId).emit(exports.NTF_USER_REJECT_FRIEND_EVENT, {
                friendId: userId,
                notificationId: createdNotification.id,
            });
        }
        return createdNotification;
    }),
};
