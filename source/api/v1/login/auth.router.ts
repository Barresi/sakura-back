import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "@src/api/async-wrapper";
import passport from "passport";

const login = Router();

login.post("/login", passport.initialize(), wrap(ctrl.login));

export default login;
