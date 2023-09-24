import config from 'config';

import Redis from '@src/clients/redis';

const redis = Redis.instance;

export const setRefreshToken = (userId: number, refreshToken: string) => {
  return redis.setex(`refresh_token:${userId}`, 86400, refreshToken);
};

export const getRefreshToken = async (userId: number) => {
  try {
    const refreshToken = await redis.get(`refresh_token:${userId}`);
    return refreshToken;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const deleteRefreshToken = async (userId: number, refreshToken: string) => {
  try {
    const storedRefreshToken = await redis.get(`refresh_token:${userId}`);
    if (storedRefreshToken === refreshToken) {
      await redis.del(`refresh_token:${userId}`);
    }
  } catch (error) {
    console.error('Error deleting refresh token:', error);
  }
};
