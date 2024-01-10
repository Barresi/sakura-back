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
exports.deleteRefreshToken = exports.getRefreshToken = exports.setRefreshToken = void 0;
const redis_1 = __importDefault(require("../../../clients/redis"));
const redis = redis_1.default.instance;
const setRefreshToken = (userId, refreshToken) => {
    return redis.setex(`refresh_token:${userId}`, 86400, refreshToken);
};
exports.setRefreshToken = setRefreshToken;
const getRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return redis.get(`refresh_token:${userId}`);
});
exports.getRefreshToken = getRefreshToken;
const deleteRefreshToken = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const storedRefreshToken = yield redis.get(`refresh_token:${userId}`);
    if (storedRefreshToken === refreshToken) {
        yield redis.del(`refresh_token:${userId}`);
    }
});
exports.deleteRefreshToken = deleteRefreshToken;
