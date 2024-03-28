import { PrismaClient } from "@prisma/client";

const DB_LOGS = process.env.DB_LOGS;

export default class Database {
  private static _instance: PrismaClient = DB_LOGS
    ? new PrismaClient({ log: [] })
    : new PrismaClient();

  public static get instance() {
    return Database._instance;
  }
}
