import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { TAuth } from './auth.interface';

// Helper to generate token
const createToken = (
  jwtPayload: { id: string; email: string; role: string; name: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as any,
  });
};

const registerUser = async (payload: TAuth['register']) => {
  const { name, email, password, role } = payload;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, 'Email already exists!');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
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

  return user;
};

const loginUser = async (payload: TAuth['login']) => {
  const { email, password } = payload;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(status.UNAUTHORIZED, 'User is deactivated!');
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, 'Incorrect password!');
  }

  // Update lastLogin
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
    },
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

  // Create JWT Payload
  const jwtPayload = {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };

  // Generate tokens
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
    user: updatedUser,
  };
};

const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt_refresh_secret) as JwtPayload;
    const { id } = decoded;

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, 'User not found!');
    }

    if (!user.isActive) {
      throw new AppError(status.UNAUTHORIZED, 'User is deactivated!');
    }

    // Create JWT Payload
    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Generate new Access Token
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in
    );

    return {
      accessToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(status.UNAUTHORIZED, 'Invalid or expired refresh token!');
  }
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
};