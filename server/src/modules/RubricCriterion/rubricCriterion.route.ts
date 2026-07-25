import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { RubricCriterionController } from './rubricCriterion.controller';

const router = express.Router();

// GET /api/v1/rubric-criteria — Get all active rubric criteria (any authenticated user)
router.get(
  '/',
  auth(Role.ADMIN, Role.RECRUITER, Role.INTERVIEWER),
  RubricCriterionController.getAllCriteria,
);

export const RubricCriterionRoutes = router;
