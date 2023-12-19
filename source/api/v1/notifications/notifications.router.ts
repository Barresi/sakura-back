import { Router } from "express";
import ctrl from "./notifications.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";

const notifications = Router();

notifications.get("/", guard, wrap(ctrl.getNotifications));

export default notifications;
