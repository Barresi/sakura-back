import { Router } from "express";
import ctrl from "./messenger.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";

const messenger = Router();

messenger.post("/create-chat", guard, wrap(ctrl.createChat));
messenger.get("/user-chats", guard, wrap(ctrl.userChats));

export default messenger;
