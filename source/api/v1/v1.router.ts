import { Router } from "express";
import auth from "./auth/auth.router";
import messenger from "./messenger/messenger.router";

const v1 = Router();

v1.use("/auth", auth);
v1.use("/messenger", messenger);

export default v1;
