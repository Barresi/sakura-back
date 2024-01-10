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
const db = database_1.default.instance;
exports.default = {
    getFriendIdFromChat: function (chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield db.chat.findUnique({
                where: { id: chatId },
                include: {
                    participants: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (!chat) {
                return null;
            }
            const participants = chat.participants.map((participant) => participant.id);
            const friendId = participants.find((participantId) => participantId !== userId);
            return friendId || null;
        });
    },
    createChatRoom: function (userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingChat = yield db.chat.findFirst({
                where: {
                    participants: {
                        every: {
                            id: {
                                in: [userId, friendId],
                            },
                        },
                    },
                },
            });
            if (existingChat) {
                return existingChat.id;
            }
            else {
                const newChat = yield db.chat.create({
                    data: {
                        participants: {
                            connect: [{ id: userId }, { id: friendId }],
                        },
                    },
                });
                return newChat.id;
            }
        });
    },
    getUserChats: function (userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userChats = yield db.chat.findMany({
                where: {
                    participants: {
                        some: {
                            id: userId,
                        },
                    },
                },
                include: {
                    participants: {
                        select: {
                            id: true,
                        },
                    },
                    messages: {
                        select: {
                            senderId: true,
                            text: true,
                            chatId: true,
                            read: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
            });
            const userChatsWithUnread = userChats.map((chat) => {
                const unreadCount = chat.messages.filter((message) => !message.read && message.senderId !== userId).length;
                return {
                    chatId: chat.id,
                    participants: chat.participants,
                    newMessage: chat.messages[0],
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                    unread: unreadCount,
                };
            });
            return userChatsWithUnread;
        });
    },
    getChatHistoryByChatId: function (chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield db.chat.findUnique({
                where: { id: chatId },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });
            if (!chat) {
                return [];
            }
            const messages = chat.messages.map((message) => ({
                senderId: message.senderId,
                text: message.text,
                chatId: message.chatId,
                read: message.read,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            }));
            const friendId = yield this.getFriendIdFromChat(chatId, userId);
            if (friendId) {
                yield db.message.updateMany({
                    where: {
                        chatId,
                        senderId: friendId,
                    },
                    data: {
                        read: true,
                    },
                });
            }
            return messages;
        });
    },
};
