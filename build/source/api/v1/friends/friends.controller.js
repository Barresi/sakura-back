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
const friend_1 = __importDefault(require("../../../data/friend"));
exports.default = {
    getAllFriends: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const friends = yield friend_1.default.getAllFriends(userId);
        return res.status(200).json(friends);
    }),
    deleteFriend: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const friendId = req.params.friendId;
        if (userId === friendId) {
            return res.status(400).json({ msg: "Вы не можете удалить себя из друзей" });
        }
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const friendExists = yield user_1.default.getUserById(friendId);
        if (!friendExists) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const areFriends = yield friend_1.default.areFriends(userId, friendId);
        if (!areFriends) {
            return res
                .status(403)
                .json({ msg: "Вы не являетесь друзьями с этим пользователем" });
        }
        yield friend_1.default.deleteFriend(userId, friendId);
        res
            .status(200)
            .json({ msg: `Вы удалили ${user.firstName} ${user.lastName} из друзей` });
    }),
};
