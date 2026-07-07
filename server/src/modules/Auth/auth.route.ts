import express from 'express';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma/client';

const router = express.Router();

router.post(
  '/register',
  auth(Role.ADMIN),
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

router.post(
  '/logout',
  AuthController.logout
);

router.get(
  '/me',
  auth(),
  AuthController.getMe
);

export const AuthRoutes = router;
