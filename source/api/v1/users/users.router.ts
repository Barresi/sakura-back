import { Router } from "express";
import ctrl from "./users.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";
import Logger from "../../../clients/logger";

const users = Router();
const logger = Logger.instance;

users.get("/", guard, wrap(ctrl.getAllUsers));
users.post("/:friendId", guard, wrap(ctrl.sendFriendRequest));
users.get("test", (req, res) => {
  logger.info("------Received GET request to /users/test------");
  res.status(200).json({ msg: "Received GET request to /users/test" });
});

export default users;
