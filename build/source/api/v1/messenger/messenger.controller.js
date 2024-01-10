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
const user_1 = __importDefault(require("../../../data/user"));
const chat_1 = __importDefault(require("../../../data/chat"));
exports.default = {
    createChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, friendId } = req.body;
        const userExists = yield user_1.default.getUserById(userId);
        if (!userExists) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const friendExists = yield user_1.default.getUserById(friendId);
        if (!friendExists) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const chatId = yield chat_1.default.createChatRoom(userId, friendId);
        res.status(200).json({ chatId });
    }),
    userChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const userChats = yield chat_1.default.getUserChats(userId);
        return res.status(200).json({ userChats });
    }),
};
