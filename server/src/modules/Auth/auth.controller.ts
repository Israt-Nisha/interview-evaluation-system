import { Request, Response } from 'express';
import status from 'http-status';
import config from '../../config';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { AuthService } from './auth.service';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await AuthService.loginUser(req.body);

  // Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    throw new AppError(status.BAD_REQUEST, 'Refresh token is required!');
  }

  const result = await AuthService.refreshToken(token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User logged out successfully!',
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User profile fetched successfully!',
    data: user,
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};