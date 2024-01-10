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
const friend_request_1 = __importDefault(require("../../../data/friend-request"));
const notification_1 = __importDefault(require("../../../data/notification"));
exports.default = {
    getAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield user_1.default.getAllUsers();
        res.status(200).json(users);
    }),
    sendFriendRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const friendId = req.params.friendId;
        if (userId === friendId) {
            return res
                .status(400)
                .json({ msg: "Вы не можете отправить заявку в друзья самому себе" });
        }
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const friend = yield user_1.default.getUserById(friendId);
        if (!friend) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const areFriends = yield friend_1.default.areFriends(userId, friendId);
        if (areFriends) {
            return res.status(400).json({ msg: "Вы уже друзья с этим пользователем" });
        }
        const existingRequest = yield friend_request_1.default.findPendingRequest(userId, friendId);
        if (existingRequest) {
            return res
                .status(400)
                .json({ msg: "Вы уже отправили заявку в друзья этому пользователю" });
        }
        yield friend_request_1.default.sendFriendRequest(userId, friendId);
        yield notification_1.default.sendFriendRequestNtf(userId, friendId, req.app.get("io"));
        res.status(200).json({
            msg: `Вы отправили заявку в друзья ${friend.firstName} ${friend.lastName}`,
        });
    }),
};
