import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { RubricCriterionService } from './rubricCriterion.service';

// ─── Get All Rubric Criteria ──────────────────────────────────────────────────

const getAllCriteria = catchAsync(async (_req: Request, res: Response) => {
  const result = await RubricCriterionService.getAllCriteria();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Rubric criteria fetched successfully!',
    data: result,
  });
});

export const RubricCriterionController = {
  getAllCriteria,
};
