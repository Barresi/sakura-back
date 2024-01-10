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
exports.setupSocketConnection = void 0;
const redis_1 = __importDefault(require("../clients/redis"));
const socket_wrapper_1 = __importDefault(require("./socket-wrapper"));
const logger_1 = __importDefault(require("../clients/logger"));
const chat_socket_1 = require("./chat.socket");
const message_socket_1 = require("./message.socket");
const redis = redis_1.default.instance;
const logger = logger_1.default.instance;
const setupSocketConnection = (io) => {
    const CONNECTION = "connection";
    const DISCONNECT = "disconnect";
    io.on(CONNECTION, (0, socket_wrapper_1.default)((socket) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = socket.handshake.query.userId;
        if (!userId) {
            logger.error("Invalid userId received");
            return;
        }
        yield redis.hset("userSockets", `userId: ${userId}`, socket.id);
        logger.info(`User with userId: ${userId} socketId: ${socket.id} connected`);
        (0, chat_socket_1.handleChatEvents)(io, socket, userId);
        (0, message_socket_1.handleMessageEvents)(io, socket);
        socket.on(DISCONNECT, () => __awaiter(void 0, void 0, void 0, function* () {
            yield redis.hdel("userSockets", `userId: ${userId}`, socket.id);
            logger.info(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
        }));
    }), CONNECTION));
};
exports.setupSocketConnection = setupSocketConnection;
