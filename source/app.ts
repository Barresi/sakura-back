import 'dotenv/config';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import api from './api/router';
import Logger from './clients/logger';
import { postMiddlewares, preMiddlewares } from './middleware/middlewares';

async function main() {
  // init app instance
  const app = express();

  app.use(cors({ credentials: true, origin: config.get('deploy.frontendUrl') }));

  // parse body to json
  app.use(express.json());
  // parse cookies
  app.use(cookieParser());

  // apply pre-route middlewares
  app.use(preMiddlewares());

  // apply api routing
  app.use('/api', api);

  // apply post-route middlewares
  app.use(postMiddlewares());

  // run app
  const port = config.get('deploy.port');
  app.listen(port, () => {
    Logger.instance.info(`\\|/ Sakura API is ready at http://localhost:${port} \\|/`);
  });
}

main();
