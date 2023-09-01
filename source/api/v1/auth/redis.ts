import { createClient } from "async-redis";
import config from "../../../config/default";

const client = createClient({ url: config.redis.url });

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (error: Error) => {
  console.error("Error connecting to Redis:", error);
});

export const setRefreshToken = async (userId: number, refreshToken: string) => {
  await client.setex(`refresh_token:${userId}`, 86400, refreshToken);
};

export const getRefreshToken = async (userId: number) => {
  try {
    const refreshToken = await client.get(`refresh_token:${userId}`);
    return refreshToken;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

export const deleteRefreshToken = async (userId: number, refreshToken: string) => {
  try {
    const storedRefreshToken = await client.get(`refresh_token:${userId}`);
    if (storedRefreshToken === refreshToken) {
      await client.del(`refresh_token:${userId}`);
    }
  } catch (error) {
    console.error("Error deleting refresh token:", error);
  }
};

export default client;
