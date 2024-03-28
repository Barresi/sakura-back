import { Router } from "express";
import ctrl from "./auth.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";
import { upload } from "../../../clients/upload";

const auth = Router();

auth.post("/signup", wrap(ctrl.signup));
auth.post("/login", wrap(ctrl.login));
auth.post("/token", wrap(ctrl.token));
auth.post("/logout", wrap(ctrl.logout));
auth.get("/userInfo", guard, wrap(ctrl.userInfo));
auth.patch(
  "/account",
  guard,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  wrap(ctrl.updateAccount)
);
auth.patch("/security", guard, wrap(ctrl.updateSecurity));
auth.delete("/delete", guard, wrap(ctrl.deleteAccount));

export default auth;
