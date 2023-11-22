import Redis from "@src/clients/redis";

const redis = Redis.instance;

export const setRefreshToken = (userId: string, refreshToken: string) => {
  return redis.setex(`refresh_token:${userId}`, 86400, refreshToken);
};

export const getRefreshToken = async (userId: string) => {
  return redis.get(`refresh_token:${userId}`);
};

export const deleteRefreshToken = async (userId: string, refreshToken: string) => {
  const storedRefreshToken = await redis.get(`refresh_token:${userId}`);
  if (storedRefreshToken === refreshToken) {
    await redis.del(`refresh_token:${userId}`);
  }
};
