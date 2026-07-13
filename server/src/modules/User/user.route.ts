import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

// POST /api/v1/users — Create a new user (Admin only)
router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

// GET /api/v1/users — Get all users with search, filter, sort & pagination (Admin only)
router.get(
  '/',
  auth(Role.ADMIN),
  UserController.getAllUsers,
);

// GET /api/v1/users/:id — Get user by ID (Admin only)
router.get(
  '/:id',
  auth(Role.ADMIN),
  UserController.getUserById,
);

// PATCH /api/v1/users/:id — Update user information (Admin only)
router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

// PATCH /api/v1/users/:id/status — Activate or deactivate user (Admin only)
router.patch(
  '/:id/status',
  auth(Role.ADMIN),
  validateRequest(UserValidation.updateStatusValidationSchema),
  UserController.updateUserStatus,
);

// DELETE /api/v1/users/:id — Soft-delete user (Admin only)
router.delete(
  '/:id',
  auth(Role.ADMIN),
  UserController.deleteUser,
);

export const UserRoutes = router;
