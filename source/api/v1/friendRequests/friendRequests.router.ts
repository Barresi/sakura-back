import { Router } from "express";
import ctrl from "./friendRequests.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";

const friendRequests = Router();

friendRequests.get("/received", guard, wrap(ctrl.getAllReceivedRequests));
friendRequests.get("/sent", guard, wrap(ctrl.getAllSentRequests));
friendRequests.post("/:requestId/accept", guard, wrap(ctrl.acceptRequest));
friendRequests.delete("/:requestId/reject", guard, wrap(ctrl.rejectRequest));
friendRequests.delete("/:requestId/cancel", guard, wrap(ctrl.cancelRequest));

export default friendRequests;
