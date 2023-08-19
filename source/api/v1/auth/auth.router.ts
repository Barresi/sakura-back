import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "@src/api/async-wrapper";

const auth = Router();

auth.post("/signup", wrap(ctrl.signup));

export default auth;
