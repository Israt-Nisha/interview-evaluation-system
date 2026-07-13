import { z } from 'zod';
import { UserValidation } from './user.validation';

export type TCreateUser = z.infer<typeof UserValidation.createUserValidationSchema>['body'];
export type TUpdateUser = z.infer<typeof UserValidation.updateUserValidationSchema>['body'];
export type TUpdateUserStatus = z.infer<typeof UserValidation.updateStatusValidationSchema>['body'];

export type TUserQuery = {
  searchTerm?: string;
  role?: string;
  isActive?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};