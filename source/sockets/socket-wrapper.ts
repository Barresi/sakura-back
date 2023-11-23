import Logger from "@src/clients/logger";
import { Socket } from "socket.io";

const logger = Logger.instance;

/**
 * Wrap Async Socket Handler - to catch async errors in socket event handlers
 * @param fn - async socket event handler
 * @returns wrapped async socket event handler
 */
export default function wrapSocket<T>(
  fn: (socket: Socket, ...args: any[]) => Promise<T>
) {
  return async (socket: Socket, ...args: any[]) => {
    try {
      await fn(socket, ...args);
    } catch (error) {
      const userId = socket.handshake.query.userId as string;
      logger.error(`Error in ${fn.name} for user ${userId}:`, error);
    }
  };
}
