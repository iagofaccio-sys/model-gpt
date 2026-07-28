import { env } from "./env";

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax" as const,
  maxAge: env.cookieRefreshTokenMaxAge,
  path: "/",
};