"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
class Logger {
    static get instance() {
        return Logger._instance;
    }
}
exports.default = Logger;
Logger._instance = (0, pino_1.default)({});
