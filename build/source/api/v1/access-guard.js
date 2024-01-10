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
const jwt_1 = require("../../jwt");
const user_1 = __importDefault(require("../../data/user"));
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({ msg: "Access token не предоставлен" });
        }
        const payload = (0, jwt_1.verifyAccessToken)(accessToken);
        if (!payload || typeof payload.userId !== "string") {
            return res.status(403).json({
                msg: "Access token устарел",
            });
        }
        const user = yield user_1.default.getUserById(payload.userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }
        req.userId = payload.userId;
        next();
    });
}
exports.default = default_1;
