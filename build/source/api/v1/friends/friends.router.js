"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friends_controller_1 = __importDefault(require("./friends.controller"));
const async_wrapper_1 = __importDefault(require("../../../api/async-wrapper"));
const access_guard_1 = __importDefault(require("../access-guard"));
const friends = (0, express_1.Router)();
friends.get("/", access_guard_1.default, (0, async_wrapper_1.default)(friends_controller_1.default.getAllFriends));
friends.delete("/:friendId", access_guard_1.default, (0, async_wrapper_1.default)(friends_controller_1.default.deleteFriend));
exports.default = friends;
