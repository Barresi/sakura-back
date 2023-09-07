import { Server } from "socket.io";
import config from "config";

export const channel = new Server(config.get("deploy.socketsPort"), {
  cors: {
    origin: config.get("deploy.frontendUrl"), // Your frontend's URL
    methods: ["GET", "POST"],
  },
});
