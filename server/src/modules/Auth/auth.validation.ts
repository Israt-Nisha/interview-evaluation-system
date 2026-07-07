import { z } from 'zod';
import { Role } from '../../../generated/prisma/client';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required',
    }).min(1, 'Name cannot be empty'),
    email: z.string({
      message: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      message: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
    role: z.nativeEnum(Role, {
      message: 'Role is required',
    }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      message: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      message: 'Password is required',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
  cookies: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
}).refine((data) => data.body?.refreshToken || data.cookies?.refreshToken, {
  message: 'Refresh token is required!',
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
};