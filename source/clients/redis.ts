import config from 'config';
import { Redis as RedisClient } from 'ioredis';

export default class Redis {
  private static _instance: RedisClient = new RedisClient(config.get('redis.url'));

  public static get instance() {
    return Redis._instance;
  }
}
