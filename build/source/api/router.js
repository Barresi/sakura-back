"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_router_1 = __importDefault(require("./v1/v1.router"));
const api = (0, express_1.Router)();
api.use("/v1", v1_router_1.default);
exports.default = api;
