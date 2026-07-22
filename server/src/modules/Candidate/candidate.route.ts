import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CandidateController } from './candidate.controller';
import { CandidateValidation } from './candidate.validation';

const router = express.Router();

// POST /api/v1/candidates — Create a new candidate (Recruiter, Admin)
router.post(
  '/',
  auth(Role.RECRUITER, Role.ADMIN),
  validateRequest(CandidateValidation.createCandidateValidationSchema),
  CandidateController.createCandidate,
);

// GET /api/v1/candidates — Get all candidates with search, filter, sort & pagination (Recruiter, Admin)
router.get(
  '/',
  auth(Role.RECRUITER, Role.ADMIN),
  CandidateController.getAllCandidates,
);

// GET /api/v1/candidates/:id — Get candidate details (Recruiter, Admin)
router.get(
  '/:id',
  auth(Role.RECRUITER, Role.ADMIN),
  CandidateController.getCandidateById,
);

// PATCH /api/v1/candidates/:id — Update candidate information (Recruiter, Admin)
router.patch(
  '/:id',
  auth(Role.RECRUITER, Role.ADMIN),
  validateRequest(CandidateValidation.updateCandidateValidationSchema),
  CandidateController.updateCandidate,
);

// PATCH /api/v1/candidates/:id/stage — Update recruitment stage (Recruiter, Admin)
router.patch(
  '/:id/stage',
  auth(Role.RECRUITER, Role.ADMIN),
  validateRequest(CandidateValidation.updateCandidateStageValidationSchema),
  CandidateController.updateCandidateStage,
);

// DELETE /api/v1/candidates/:id — Delete candidate (Recruiter, Admin)
router.delete(
  '/:id',
  auth(Role.RECRUITER, Role.ADMIN),
  CandidateController.deleteCandidate,
);

export const CandidateRoutes = router;
