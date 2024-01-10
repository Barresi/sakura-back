"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messenger_controller_1 = __importDefault(require("./messenger.controller"));
const async_wrapper_1 = __importDefault(require("../../../api/async-wrapper"));
const access_guard_1 = __importDefault(require("../access-guard"));
const messenger = (0, express_1.Router)();
messenger.post("/create-chat", access_guard_1.default, (0, async_wrapper_1.default)(messenger_controller_1.default.createChat));
messenger.get("/user-chats", access_guard_1.default, (0, async_wrapper_1.default)(messenger_controller_1.default.userChats));
exports.default = messenger;
