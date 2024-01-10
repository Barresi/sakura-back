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
const friend_request_1 = __importDefault(require("../../../data/friend-request"));
const notification_1 = __importDefault(require("../../../data/notification"));
const client_1 = require("@prisma/client");
exports.default = {
    getAllReceivedRequests: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const requests = yield friend_request_1.default.getAllReceivedRequests(userId);
        return res.status(200).json(requests);
    }),
    getAllSentRequests: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const requests = yield friend_request_1.default.getAllSentRequests(userId);
        return res.status(200).json(requests);
    }),
    acceptRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const requestId = req.params.requestId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const request = yield friend_request_1.default.findRequestById(requestId, userId);
        if (!request) {
            return res.status(404).json({ msg: "Заявка в друзья не найдена" });
        }
        if (request.status === client_1.RequestStatus.ACCEPTED) {
            return res.status(400).json({ msg: "Вы уже приняли эту заявку" });
        }
        if (request.fromId === userId) {
            return res.status(400).json({ msg: "Вы не можете принять свою заявку" });
        }
        yield friend_request_1.default.acceptRequest(userId, requestId);
        const friendId = yield friend_request_1.default.findFriendId(requestId, userId);
        if (!friendId) {
            return res.status(404).json({ msg: "Друг не найден" });
        }
        yield notification_1.default.sendAcceptRequestNtf(userId, friendId, req.app.get("io"));
        return res
            .status(200)
            .json({ msg: `Вы приняли заявку в друзья от ${user.firstName} ${user.lastName}` });
    }),
    rejectRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const requestId = req.params.requestId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const request = yield friend_request_1.default.findRequestById(requestId, userId);
        if (!request) {
            return res.status(404).json({ msg: "Заявка в друзья не найдена" });
        }
        if (request.toId !== userId) {
            return res
                .status(403)
                .json({ msg: "Вы можете отклонить только входящие вам заявки" });
        }
        const friendId = yield friend_request_1.default.findFriendId(requestId, userId);
        if (!friendId) {
            return res.status(404).json({ msg: "Друг не найден" });
        }
        yield notification_1.default.sendRejectRequestNtf(userId, friendId, req.app.get("io"));
        yield friend_request_1.default.rejectRequest(userId, requestId);
        return res.status(200).json({
            msg: `Вы отклонили заявку в друзья от ${user.firstName} ${user.lastName}`,
        });
    }),
    cancelRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const requestId = req.params.requestId;
        const user = yield user_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        const request = yield friend_request_1.default.findRequestById(requestId, userId);
        if (!request) {
            return res.status(404).json({ msg: "Заявка в друзья не найдена" });
        }
        if (request.fromId !== userId) {
            return res
                .status(403)
                .json({ msg: "Вы можете отменить только исходящие от вас заявки" });
        }
        yield friend_request_1.default.cancelRequest(userId, requestId);
        return res
            .status(200)
            .json({ msg: `Вы отменили заявку в друзья от ${user.firstName} ${user.lastName}` });
    }),
};
