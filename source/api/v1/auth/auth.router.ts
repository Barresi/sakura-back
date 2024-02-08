import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";

const auth = Router();

auth.post("/signup", wrap(ctrl.signup));
auth.post("/login", wrap(ctrl.login));
auth.post("/token", wrap(ctrl.token));
auth.post("/logout", wrap(ctrl.logout));
auth.get("/userInfo", guard, wrap(ctrl.userInfo));
// auth.patch("/account", guard, wrap(ctrl.updateAccount));
auth.patch("/account", guard, (req, res) => {
  console.log("Received PATCH request to /account");
});

auth.patch("/security", guard, wrap(ctrl.updateSecurity));
auth.delete("/delete", guard, wrap(ctrl.deleteAccount));

export default auth;
