import { Router } from "express";
import ctrl from "./friends.controller";
import wrap from "@src/api/async-wrapper";
import guard from "../access-guard";

const friends = Router();

friends.post("/request", guard, wrap(ctrl.request));

export default friends;
