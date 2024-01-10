"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = __importDefault(require("./notifications.controller"));
const async_wrapper_1 = __importDefault(require("../../../api/async-wrapper"));
const access_guard_1 = __importDefault(require("../access-guard"));
const notifications = (0, express_1.Router)();
notifications.get("/", access_guard_1.default, (0, async_wrapper_1.default)(notifications_controller_1.default.getNotifications));
exports.default = notifications;
