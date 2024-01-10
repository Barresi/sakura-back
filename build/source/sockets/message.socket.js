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
exports.handleMessageEvents = void 0;
const message_1 = __importDefault(require("../data/message"));
const ntfMessage_socket_1 = require("./ntfMessage.socket");
const handleMessageEvents = (io, socket) => {
    const SEND_MESSAGE_EVENT = "sendMessage";
    const GET_MESSAGE_EVENT = "getMessage";
    socket.on(SEND_MESSAGE_EVENT, (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, message, chatId } = payload;
        yield message_1.default.saveMessage({
            senderId: userId,
            text: message,
            chatId: chatId,
        });
        const lastMessage = yield message_1.default.getLastMessageByChatId(chatId, userId);
        if (lastMessage) {
            io.to(chatId).emit(GET_MESSAGE_EVENT, lastMessage);
            (0, ntfMessage_socket_1.handleNtfMessageEvents)(io, userId, chatId, lastMessage);
        }
    }));
};
exports.handleMessageEvents = handleMessageEvents;
