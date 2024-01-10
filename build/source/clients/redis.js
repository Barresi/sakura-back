"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ioredis_1 = require("ioredis");
const REDIS_URL = process.env.REDIS_URL;
class Redis {
    static get instance() {
        return Redis._instance;
    }
}
exports.default = Redis;
Redis._instance = new ioredis_1.Redis(REDIS_URL);
