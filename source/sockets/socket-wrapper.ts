import Logger from "../clients/logger";
import { Socket } from "socket.io";

const logger = Logger.instance;

/**
 * Wrap Async Socket Handler - to catch async errors in socket event handlers
 * @param fn - async socket event handler
 * @returns wrapped async socket event handler
 */
export default function wrapSocket<T>(
  fn: (socket: Socket, ...args: any[]) => Promise<T>,
  eventName: string
) {
  return async (socket: Socket, ...args: any[]) => {
    try {
      await fn(socket, ...args);
    } catch (error) {
      logger.error(`Error in socket's ${eventName}`, error);
    }
  };
}
