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
exports.handleNtfMessageEvents = void 0;
const chat_1 = __importDefault(require("../data/chat"));
const redis_1 = __importDefault(require("../clients/redis"));
const redis = redis_1.default.instance;
const handleNtfMessageEvents = (io, userId, chatId, lastMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const NTF_GET_MESSAGE_EVENT = "ntfGetMessage";
    const friendId = yield chat_1.default.getFriendIdFromChat(chatId, userId);
    const friendSocketId = yield redis.hget("userSockets", `userId: ${friendId}`);
    const userChatId = yield redis.hget("chatRooms", `userId: ${userId}`);
    const friendChatId = yield redis.hget("chatRooms", `userId: ${friendId}`);
    if (friendSocketId && (friendChatId === null || friendChatId !== userChatId)) {
        io.to(friendSocketId).emit(NTF_GET_MESSAGE_EVENT, lastMessage);
    }
});
exports.handleNtfMessageEvents = handleNtfMessageEvents;
