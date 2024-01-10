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
const database_1 = __importDefault(require("../clients/database"));
const chat_1 = __importDefault(require("../data/chat"));
const redis_1 = __importDefault(require("../clients/redis"));
const db = database_1.default.instance;
const redis = redis_1.default.instance;
exports.default = {
    saveMessage: function (message) {
        return __awaiter(this, void 0, void 0, function* () {
            return db.message.create({ data: message });
        });
    },
    getLastMessageByChatId: function (chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastMessage = yield db.message.findFirst({
                where: {
                    chatId: chatId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            if (!lastMessage) {
                return null;
            }
            const friendId = yield chat_1.default.getFriendIdFromChat(chatId, userId);
            const isFriendInChat = friendId
                ? (yield redis.hget("chatRooms", `userId: ${friendId}`)) === chatId
                : false;
            const read = isFriendInChat;
            yield db.message.update({
                where: {
                    id: lastMessage.id,
                },
                data: {
                    read: read,
                },
            });
            return {
                senderId: lastMessage.senderId,
                text: lastMessage.text,
                chatId: lastMessage.chatId,
                read: read,
                createdAt: lastMessage.createdAt,
                updatedAt: lastMessage.updatedAt,
            };
        });
    },
};
