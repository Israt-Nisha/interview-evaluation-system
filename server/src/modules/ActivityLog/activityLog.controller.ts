import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { ActivityLogService } from './activityLog.service';

// ─── Get All Activity Logs ────────────────────────────────────────────────────

const getAllActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await ActivityLogService.getAllActivityLogs(req.query as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Activity logs fetched successfully!',
    data,
    meta,
  });
});

// ─── Get Activity Log By ID ───────────────────────────────────────────────────

const getActivityLogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ActivityLogService.getActivityLogById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Activity log fetched successfully!',
    data: result,
  });
});

export const ActivityLogController = {
  getAllActivityLogs,
  getActivityLogById,
};
