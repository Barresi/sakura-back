import { PrismaClient } from "@prisma/client";
import config from "config";

export default class Database {
  private static _instance: PrismaClient = Number(config.get("database.logs"))
    ? new PrismaClient({ log: ["query"] })
    : new PrismaClient();

  public static get instance() {
    return Database._instance;
  }
}
