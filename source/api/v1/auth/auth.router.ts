import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "@src/api/async-wrapper";
import guard from "../access-guard";

const auth = Router();

auth.post("/signup", wrap(ctrl.signup));
auth.post("/login", wrap(ctrl.login));
auth.post("/token", wrap(ctrl.token));
auth.post("/logout", wrap(ctrl.logout));
auth.get("/userInfo", guard, wrap(ctrl.userInfo));

export default auth;
