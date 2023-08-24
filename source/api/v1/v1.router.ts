import { Router } from "express";
import auth from "./auth/auth.router";
import login from "./login/auth.router";

const v1 = Router();

v1.use("/auth", auth);
v1.use("/auth", login);

export default v1;
