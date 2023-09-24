import pino from 'pino';

export default class Logger {
  private static _instance: ReturnType<typeof pino> = pino({});

  public static get instance() {
    return Logger._instance;
  }
}
