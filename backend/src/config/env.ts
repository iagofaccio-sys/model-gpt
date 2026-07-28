import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente não encontrada: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 3333),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: getEnv("DATABASE_URL"),

  jwtAccessSecret: getEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET"),

  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  cookieRefreshTokenName:
    process.env.COOKIE_REFRESH_TOKEN_NAME || "refreshToken",

  cookieRefreshTokenMaxAge: Number(
    process.env.COOKIE_REFRESH_TOKEN_MAX_AGE || 604800000
  ),
};