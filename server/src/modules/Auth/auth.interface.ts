import { Role } from '../../../generated/prisma/client';
import { z } from 'zod';
import { AuthValidation } from './auth.validation';

export type TAuth = {
  register: z.infer<typeof AuthValidation.registerValidationSchema>['body'];
  login: z.infer<typeof AuthValidation.loginValidationSchema>['body'];
};