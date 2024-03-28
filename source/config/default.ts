export default {
  deploy: {
    port: process.env.EXPRESS_PORT,
    frontendUrl: process.env.CORS_ORIGIN,
  },
  database: {
    logs: process.env.DB_LOGS,
  },
  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
};
