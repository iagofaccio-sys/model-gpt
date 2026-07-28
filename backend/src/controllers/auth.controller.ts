import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { refreshCookieOptions } from "../config/cookies";
import { env } from "../config/env";

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.cookie(
        env.cookieRefreshTokenName,
        result.refreshToken,
        refreshCookieOptions
      );

      return res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[env.cookieRefreshTokenName];

      await authService.logout(refreshToken);

      res.clearCookie(env.cookieRefreshTokenName, {
        ...refreshCookieOptions,
        maxAge: undefined,
      });

      return res.status(200).json({
        message: "Logout realizado com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const oldRefreshToken = req.cookies[env.cookieRefreshTokenName];

      const result = await authService.refreshToken(oldRefreshToken);

      res.cookie(
        env.cookieRefreshTokenName,
        result.refreshToken,
        refreshCookieOptions
      );

      return res.status(200).json({
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
};