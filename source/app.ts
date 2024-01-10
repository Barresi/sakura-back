import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import Logger from "./clients/logger";
import { postMiddlewares, preMiddlewares } from "./middlewares";
import api from "./api/router";
import { setupSocketConnection } from "./sockets/setup.socket";
import swaggerDocs from "./clients/swagger";

// const PORT = process.env.EXPRESS_PORT || 5000;
// const HOST = process.env.HOST || "localhost";
// const CORS_ORIGIN = process.env.FRONTEND_URL || "https://ssakura.ru";

// const CORS_ORIGIN = process.env.FRONTEND_URL || "https://sakura-front-a4sd99sfe-barresis-team.vercel.app/";
const PORT = 5000;
const HOST = "sakura-back";
const CORS_ORIGIN = "https://ssakura.ru"

async function main() {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  app.use(cors({ credentials: true, origin: CORS_ORIGIN }));

  app.use(express.json());
  app.use(cookieParser());

  app.get("/healthcheck", (req, res) => {
    res.json({
      status: "ok",
      port: PORT,
    });
  });

  app.use(preMiddlewares());

  app.use("/api", api);

  setupSocketConnection(io);
  app.set("io", io);

  app.use(postMiddlewares());

  server.listen({ port: PORT, host: HOST });
  Logger.instance.info("\\|/ Sakura API is ready \\|/");

  swaggerDocs(app, HOST, Number(PORT));
}

main();
