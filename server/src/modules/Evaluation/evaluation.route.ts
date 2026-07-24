import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { EvaluationController } from './evaluation.controller';
import { EvaluationValidation } from './evaluation.validation';

const router = express.Router();

// POST /api/v1/evaluations — Submit evaluation (Assigned Interviewer only)
router.post(
  '/',
  auth(Role.INTERVIEWER),
  validateRequest(EvaluationValidation.createEvaluationValidationSchema),
  EvaluationController.createEvaluation,
);

// GET /api/v1/evaluations — Get all evaluations (Recruiter, Admin)
router.get(
  '/',
  auth(Role.RECRUITER, Role.ADMIN),
  EvaluationController.getAllEvaluations,
);

// GET /api/v1/evaluations/:id — Get evaluation details (Recruiter, Admin, Author Interviewer)
router.get(
  '/:id',
  auth(Role.ADMIN, Role.RECRUITER, Role.INTERVIEWER),
  EvaluationController.getEvaluationById,
);

// PATCH /api/v1/evaluations/:id/unlock — Unlock evaluation (Admin only)
router.patch(
  '/:id/unlock',
  auth(Role.ADMIN),
  validateRequest(EvaluationValidation.unlockEvaluationValidationSchema),
  EvaluationController.unlockEvaluation,
);

// PATCH /api/v1/evaluations/:id/relock — Re-lock evaluation (Admin only)
router.patch(
  '/:id/relock',
  auth(Role.ADMIN),
  EvaluationController.relockEvaluation,
);

export const EvaluationRoutes = router;
