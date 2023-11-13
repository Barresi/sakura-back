import { Router } from "express";
import ctrl from "./friends.controller";
import wrap from "@src/api/async-wrapper";
import guard from "../access-guard";

const friends = Router();

friends.get("/", guard, wrap(ctrl.getAllFriends));
friends.delete("/:friendId", guard, wrap(ctrl.deleteFriend));

export default friends;
