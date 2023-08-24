declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    NODE_CONFIG_DIR: string;
    EXPRESS_PORT: string;
    FRONTEND_URL: string;
    DB_URL: string;
    DB_LOGS: string;
    REDIS_URL: string;
    REDIS_PORT: string;
    JWT_SECRET: string;
  }
}
