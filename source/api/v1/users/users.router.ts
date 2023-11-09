import { Router } from "express";
import ctrl from "./users.controller";
import wrap from "@src/api/async-wrapper";
import guard from "../access-guard";

const users = Router();

users.get("/", guard, wrap(ctrl.getAllUsers));
users.post("/:friendId", guard, wrap(ctrl.sendFriendRequest));

export default users;
