import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

// GET /api/v1/dashboard/admin — Admin dashboard statistics (Admin only)
router.get(
  '/admin',
  auth(Role.ADMIN),
  DashboardController.getAdminDashboard,
);

// GET /api/v1/dashboard/recruiter — Recruiter dashboard (Recruiter only)
router.get(
  '/recruiter',
  auth(Role.RECRUITER),
  DashboardController.getRecruiterDashboard,
);

// GET /api/v1/dashboard/interviewer — Interviewer dashboard (Interviewer only)
router.get(
  '/interviewer',
  auth(Role.INTERVIEWER),
  DashboardController.getInterviewerDashboard,
);

export const DashboardRoutes = router;
