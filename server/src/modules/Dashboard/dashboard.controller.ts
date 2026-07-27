import { Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { DashboardService } from './dashboard.service';

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const getAdminDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getAdminDashboard();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Admin dashboard fetched successfully!',
    data: result,
  });
});

// ─── Recruiter Dashboard ──────────────────────────────────────────────────────

const getRecruiterDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getRecruiterDashboard();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Recruiter dashboard fetched successfully!',
    data: result,
  });
});

// ─── Interviewer Dashboard ────────────────────────────────────────────────────

const getInterviewerDashboard = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const result = await DashboardService.getInterviewerDashboard(req.user.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Interviewer dashboard fetched successfully!',
    data: result,
  });
});

export const DashboardController = {
  getAdminDashboard,
  getRecruiterDashboard,
  getInterviewerDashboard,
};
