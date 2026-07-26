import express from 'express';
import { Role } from '../../../generated/prisma/client';
import { auth } from '../../middlewares/auth';
import { ActivityLogController } from './activityLog.controller';

const router = express.Router();

// GET /api/v1/activity-logs — Get all activity logs (Admin only)
router.get(
  '/',
  auth(Role.ADMIN),
  ActivityLogController.getAllActivityLogs,
);

// GET /api/v1/activity-logs/:id — Get activity log details (Admin only)
router.get(
  '/:id',
  auth(Role.ADMIN),
  ActivityLogController.getActivityLogById,
);

export const ActivityLogRoutes = router;
