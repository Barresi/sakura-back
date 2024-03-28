import "dotenv/config";
import { Redis as RedisClient } from "ioredis";

const REDIS_URL = process.env.REDIS_URL as string;

export default class Redis {
  private static _instance: RedisClient = new RedisClient(REDIS_URL);

  public static get instance() {
    return Redis._instance;
  }
}
