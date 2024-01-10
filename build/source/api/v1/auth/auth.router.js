"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const async_wrapper_1 = __importDefault(require("../../../api/async-wrapper"));
const access_guard_1 = __importDefault(require("../access-guard"));
const auth = (0, express_1.Router)();
auth.post("/signup", (0, async_wrapper_1.default)(auth_controller_1.default.signup));
auth.post("/login", (0, async_wrapper_1.default)(auth_controller_1.default.login));
auth.post("/token", (0, async_wrapper_1.default)(auth_controller_1.default.token));
auth.post("/logout", (0, async_wrapper_1.default)(auth_controller_1.default.logout));
auth.get("/userInfo", access_guard_1.default, (0, async_wrapper_1.default)(auth_controller_1.default.userInfo));
exports.default = auth;
