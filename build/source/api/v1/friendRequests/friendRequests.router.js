"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendRequests_controller_1 = __importDefault(require("./friendRequests.controller"));
const async_wrapper_1 = __importDefault(require("../../../api/async-wrapper"));
const access_guard_1 = __importDefault(require("../access-guard"));
const friendRequests = (0, express_1.Router)();
friendRequests.get("/received", access_guard_1.default, (0, async_wrapper_1.default)(friendRequests_controller_1.default.getAllReceivedRequests));
friendRequests.get("/sent", access_guard_1.default, (0, async_wrapper_1.default)(friendRequests_controller_1.default.getAllSentRequests));
friendRequests.post("/:requestId/accept", access_guard_1.default, (0, async_wrapper_1.default)(friendRequests_controller_1.default.acceptRequest));
friendRequests.delete("/:requestId/reject", access_guard_1.default, (0, async_wrapper_1.default)(friendRequests_controller_1.default.rejectRequest));
friendRequests.delete("/:requestId/cancel", access_guard_1.default, (0, async_wrapper_1.default)(friendRequests_controller_1.default.cancelRequest));
exports.default = friendRequests;
