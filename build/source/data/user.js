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
    createUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        return db.user.create({ data: user });
    }),
    getUserByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return db.user.findUnique({ where: { email } });
    }),
    getUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });
    }),
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return db.user.findMany({
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                friends: true,
                friended: true,
            },
        });
    }),
};
