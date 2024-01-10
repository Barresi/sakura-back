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
const bcryptjs_1 = require("bcryptjs");
const auth_validation_1 = require("./auth.validation");
const user_1 = __importDefault(require("../../../data/user"));
const jwt_1 = require("../../../jwt");
const auth_tokens_1 = require("./auth.tokens");
exports.default = {
    signup: function signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = (0, auth_validation_1.signup)(req, res);
            if (!body) {
                res.status(400).json({ msg: "Неверно заполнена форма регистрации" });
                return;
            }
            const existingUser = yield user_1.default.getUserByEmail(body.email);
            if (existingUser) {
                res.status(409).json({ msg: "Этот email уже зарегистрирован" });
                return;
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(body.password, yield (0, bcryptjs_1.genSalt)());
            const user = yield user_1.default.createUser(Object.assign(Object.assign({}, body), { password: hashedPassword }));
            res.status(200).json({ id: user.id });
        });
    },
    login: function login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield user_1.default.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ msg: "Неверный email или пароль" });
            }
            const passwordMatch = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ msg: "Неверный email или пароль" });
            }
            const accessToken = (0, jwt_1.generateAccessToken)(user.id);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
            yield (0, auth_tokens_1.setRefreshToken)(user.id, refreshToken);
            const userWithoutPassword = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };
            res.status(200).json({ accessToken, refreshToken, userWithoutPassword });
        });
    },
    token: function token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ msg: "Refresh token не предоставлен" });
            }
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            if (!payload) {
                return res.status(403).json({ msg: "Неверный refresh token" });
            }
            const storedRefreshToken = yield (0, auth_tokens_1.getRefreshToken)(payload.userId);
            if (storedRefreshToken !== refreshToken) {
                return res.status(403).json({ msg: "Неверный refresh token" });
            }
            const newAccessToken = (0, jwt_1.generateAccessToken)(payload.userId);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(payload.userId);
            yield (0, auth_tokens_1.setRefreshToken)(payload.userId, newRefreshToken);
            yield (0, auth_tokens_1.deleteRefreshToken)(payload.userId, refreshToken);
            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        });
    },
    logout: function logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ msg: "Refresh token не предоставлен" });
            }
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            if (!payload) {
                return res.status(403).json({ msg: "Неверный refresh token" });
            }
            yield (0, auth_tokens_1.deleteRefreshToken)(payload.userId, refreshToken);
            res.status(200).json({ msg: "Вы успешно вышли из своего аккаунта" });
        });
    },
    userInfo: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const user = yield user_1.default.getUserById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Пользователь не найден" });
            }
            res.status(200).json({ user });
        });
    },
};
