"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMiddlewares = exports.preMiddlewares = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const logger_1 = __importDefault(require("./clients/logger"));
const zod_1 = require("zod");
const logger = logger_1.default.instance;
const expressLogger = (0, pino_http_1.default)({
    logger,
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
        }),
    },
});
function preMiddlewares() {
    return [expressLogger];
}
exports.preMiddlewares = preMiddlewares;
// - - - - - - //
function errorHandler(err, req, res, next) {
    req.log.error(err);
    if (err instanceof zod_1.ZodError) {
        res.status(404).json({ msg: "Некорректные данные" });
    }
    res.status(500).json({ msg: "Внутренняя ошибка сервера" });
}
function postMiddlewares() {
    return [errorHandler];
}
exports.postMiddlewares = postMiddlewares;
