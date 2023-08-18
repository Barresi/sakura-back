import { Router } from "express";
import auth from "./auth/auth.router";

const v1 = Router();

v1.use("/auth", auth);

export default v1;
