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
exports.handleChatEvents = void 0;
const chat_1 = __importDefault(require("../data/chat"));
const redis_1 = __importDefault(require("../clients/redis"));
const logger_1 = __importDefault(require("../clients/logger"));
const redis = redis_1.default.instance;
const logger = logger_1.default.instance;
const handleChatEvents = (io, socket, userId) => {
    const JOIN_CHAT_EVENT = "joinChat";
    const GET_HISTORY_EVENT = "getHistory";
    const LEAVE_CHAT_EVENT = "leaveChat";
    socket.on(JOIN_CHAT_EVENT, (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(chatId);
        yield redis.hset("chatRooms", `userId: ${userId}`, chatId);
        logger.info(`User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId}`);
        const history = yield chat_1.default.getChatHistoryByChatId(chatId, userId);
        if (history) {
            io.to(chatId).emit(GET_HISTORY_EVENT, history);
        }
    }));
    socket.on(LEAVE_CHAT_EVENT, (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(chatId);
        yield redis.hdel("chatRooms", `userId: ${userId}`, chatId);
        logger.info(`User with userId: ${userId} socketId: ${socket.id} left the chat ${chatId}`);
    }));
};
exports.handleChatEvents = handleChatEvents;
