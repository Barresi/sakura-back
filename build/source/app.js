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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./clients/logger"));
const middlewares_1 = require("./middlewares");
const router_1 = __importDefault(require("./api/router"));
const setup_socket_1 = require("./sockets/setup.socket");
const swagger_1 = __importDefault(require("./clients/swagger"));
// const PORT = process.env.EXPRESS_PORT || 5000;
// const HOST = process.env.HOST || "localhost";
// const CORS_ORIGIN = process.env.FRONTEND_URL || "https://ssakura.ru";
// const CORS_ORIGIN = process.env.FRONTEND_URL || "https://sakura-front-a4sd99sfe-barresis-team.vercel.app/";
const PORT = 5000;
const HOST = "sakura-back";
const CORS_ORIGIN = "https://ssakura.ru";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: CORS_ORIGIN,
                methods: ["GET", "POST"],
            },
        });
        app.use((0, cors_1.default)({ credentials: true, origin: CORS_ORIGIN }));
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        app.get("/healthcheck", (req, res) => {
            res.json({
                status: "ok",
                port: PORT,
            });
        });
        app.use((0, middlewares_1.preMiddlewares)());
        app.use("/api", router_1.default);
        (0, setup_socket_1.setupSocketConnection)(io);
        app.set("io", io);
        app.use((0, middlewares_1.postMiddlewares)());
        server.listen({ port: PORT, host: HOST });
        logger_1.default.instance.info("\\|/ Sakura API is ready \\|/");
        (0, swagger_1.default)(app, HOST, Number(PORT));
    });
}
main();
