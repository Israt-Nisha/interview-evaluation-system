import { z } from 'zod';
import { Role } from '../../../generated/prisma/client';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(1, 'Name cannot be empty'),
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    role: z.nativeEnum(Role, { message: 'Role must be ADMIN, RECRUITER, or INTERVIEWER' }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.nativeEnum(Role, { message: 'Role must be ADMIN, RECRUITER, or INTERVIEWER' }).optional(),
  }),
});

const updateStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean({ message: 'isActive must be a boolean value' }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateStatusValidationSchema,
};