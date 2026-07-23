import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { InterviewSessionController } from './interviewSession.controller';
import { InterviewSessionValidation } from './interviewSession.validation';

const router = express.Router();

// POST /api/v1/interview-sessions — Schedule an interview session (Recruiter only)
router.post(
  '/',
  auth(Role.RECRUITER),
  validateRequest(InterviewSessionValidation.createSessionValidationSchema),
  InterviewSessionController.createSession,
);

// GET /api/v1/interview-sessions — Get all sessions (Admin, Recruiter, Interviewer)
router.get(
  '/',
  auth(Role.ADMIN, Role.RECRUITER, Role.INTERVIEWER),
  InterviewSessionController.getAllSessions,
);

// GET /api/v1/interview-sessions/:id — Get session details (Admin, Recruiter, Assigned Interviewer)
router.get(
  '/:id',
  auth(Role.ADMIN, Role.RECRUITER, Role.INTERVIEWER),
  InterviewSessionController.getSessionById,
);

// PATCH /api/v1/interview-sessions/:id — Update session (Recruiter only)
router.patch(
  '/:id',
  auth(Role.RECRUITER),
  validateRequest(InterviewSessionValidation.updateSessionValidationSchema),
  InterviewSessionController.updateSession,
);

// PATCH /api/v1/interview-sessions/:id/status — Update session status (Recruiter only)
router.patch(
  '/:id/status',
  auth(Role.RECRUITER),
  validateRequest(InterviewSessionValidation.updateSessionStatusValidationSchema),
  InterviewSessionController.updateSessionStatus,
);

// DELETE /api/v1/interview-sessions/:id — Cancel/delete session (Recruiter only)
router.delete(
  '/:id',
  auth(Role.RECRUITER),
  InterviewSessionController.deleteSession,
);

export const InterviewSessionRoutes = router;
