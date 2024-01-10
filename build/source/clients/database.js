"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const DB_LOGS = process.env.DB_LOGS;
class Database {
    static get instance() {
        return Database._instance;
    }
}
exports.default = Database;
Database._instance = DB_LOGS
    ? new client_1.PrismaClient({ log: [] })
    : new client_1.PrismaClient();
