import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/client';
import { catchAsync } from '../sheard/catchAsync';

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // If no users exist in the database, allow registration/access to register the first admin
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'Token is missing!');
    }

    try {
      const decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;
      
      const { id } = decoded;

      // Find user from database
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found!');
      }

      if (!user.isActive) {
        throw new AppError(status.UNAUTHORIZED, 'User is deactivated!');
      }

      // Check role authorization
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new AppError(status.FORBIDDEN, 'You do not have permission to access this resource!');
      }

      // Attach user payload to request
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('JWT Verification Error:', error);
      throw new AppError(status.UNAUTHORIZED, `Invalid or expired token! ${error.message || ''}`);
    }
  });
};
