import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "@src/api/async-wrapper";

const auth = Router();

auth.post("/signup", wrap(ctrl.signup));
auth.post("/login", wrap(ctrl.login));
auth.post("/token", wrap(ctrl.token));
auth.delete("/logout", wrap(ctrl.logout));
auth.get("/me", wrap(ctrl.me));

export default auth;
