import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "@src/api/async-wrapper";
import guard from "../access-guard";

const auth = Router();

auth.post("/signup", wrap(ctrl.signup));
auth.post("/login", wrap(ctrl.login));
auth.post("/token", wrap(ctrl.token));
auth.post("/logout", wrap(ctrl.logout));
auth.get("/me", guard, wrap(ctrl.me));

export default auth;
