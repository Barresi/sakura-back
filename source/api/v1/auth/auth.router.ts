import { Router } from "express";
import ctrl from "./auth.controller";
import valid from "./auth.validation";
import wrap from "@src/api/async-wrapper";

const auth = Router();

auth.post("/signup", valid.signup, wrap(ctrl.signup));

export default auth;
