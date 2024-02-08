import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";
import Logger from "../../../clients/logger";

const auth = Router();
const logger = Logger.instance;

auth.post("/signup", wrap(ctrl.signup));
auth.post("/login", wrap(ctrl.login));
auth.post("/token", wrap(ctrl.token));
auth.post("/logout", wrap(ctrl.logout));
// auth.get("/userInfo", guard, wrap(ctrl.userInfo));
auth.get("/userInfo", guard, (req, res) => {
  logger.info("------Received GET request to /userInfo------");
  res.status(200).json({ msg: "Received GET request to /userInfo" });
});

// auth.patch("/account", guard, wrap(ctrl.updateAccount));
auth.post("/account", guard, (req, res) => {
  logger.info("------Received PATCH request to /account------");
  res.status(200).json({ msg: "Received PATCH request to /account" });
});

auth.patch("/security", guard, wrap(ctrl.updateSecurity));
auth.delete("/delete", guard, wrap(ctrl.deleteAccount));

export default auth;
