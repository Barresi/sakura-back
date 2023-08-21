import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "config";

import Logger from "./clients/logger";
import { postMiddlewares, preMiddlewares } from "./middlewares";
import api from "./api/router";

async function main() {
  // init app instance
  const app = express();

  app.use(cors({ credentials: true, origin: config.get("deploy.frontendUrl") }));

  // parse body to json
  app.use(express.json());
  // parse cookies
  app.use(cookieParser());

  // apply pre-route middlewares
  app.use(preMiddlewares());

  // apply api routing
  app.use("/api", api);

  // apply post-route middlewares
  app.use(postMiddlewares());

  // run app
  app.listen(config.get("deploy.port"));
  Logger.instance.info("\\|/ Sakura API is ready \\|/");
}

main();
