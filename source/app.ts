import 'dotenv/config';
import http from 'http';

import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import api from './api/router';
import Logger from './clients/logger';
import { postMiddlewares, preMiddlewares } from './middleware/middlewares';
import { setupChatEvent } from './sockets/messages.socket';

async function main() {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: config.get('deploy.frontendUrl'),
      methods: ['GET', 'POST'],
    },
  });

  setupChatEvent(io);

  app.use(cors({ credentials: true, origin: config.get('deploy.frontendUrl') }));

  app.use(express.json());
  app.use(cookieParser());

  app.use(preMiddlewares());

  app.use('/api', api);

  app.use(postMiddlewares());

  const port = config.get('deploy.port');
  app.listen(port, () => {
    Logger.instance.info(`\\|/ Sakura API is ready at http://localhost:${port} \\|/`);
  });
}

main();
