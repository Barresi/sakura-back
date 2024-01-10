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
const logger_1 = __importDefault(require("../clients/logger"));
const logger = logger_1.default.instance;
/**
 * Wrap Async Socket Handler - to catch async errors in socket event handlers
 * @param fn - async socket event handler
 * @returns wrapped async socket event handler
 */
function wrapSocket(fn, eventName) {
    return (socket, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield fn(socket, ...args);
        }
        catch (error) {
            logger.error(`Error in socket's ${eventName}`, error);
        }
    });
}
exports.default = wrapSocket;
