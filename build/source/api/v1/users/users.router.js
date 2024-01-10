"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./users.controller"));
const async_wrapper_1 = __importDefault(require("../../../api/async-wrapper"));
const access_guard_1 = __importDefault(require("../access-guard"));
const users = (0, express_1.Router)();
users.get("/", access_guard_1.default, (0, async_wrapper_1.default)(users_controller_1.default.getAllUsers));
users.post("/:friendId", access_guard_1.default, (0, async_wrapper_1.default)(users_controller_1.default.sendFriendRequest));
exports.default = users;
