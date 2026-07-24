import { Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { EvaluationService } from './evaluation.service';

// ─── Create Evaluation (Submit) ───────────────────────────────────────────────

const createEvaluation = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const result = await EvaluationService.createEvaluation(req.body, req.user.userId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Evaluation submitted successfully!',
    data: result,
  });
});

// ─── Get All Evaluations ──────────────────────────────────────────────────────

const getAllEvaluations = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await EvaluationService.getAllEvaluations(req.query as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Evaluations fetched successfully!',
    data,
    meta,
  });
});

// ─── Get Evaluation By ID ─────────────────────────────────────────────────────

const getEvaluationById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const { id } = req.params;
  const result = await EvaluationService.getEvaluationById(id as string, req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Evaluation fetched successfully!',
    data: result,
  });
});

// ─── Unlock Evaluation ────────────────────────────────────────────────────────

const unlockEvaluation = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const { id } = req.params;
  const result = await EvaluationService.unlockEvaluation(id as string, req.user.userId, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Evaluation unlocked successfully!',
    data: result,
  });
});

// ─── Re-lock Evaluation ───────────────────────────────────────────────────────

const relockEvaluation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EvaluationService.relockEvaluation(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Evaluation re-locked successfully!',
    data: result,
  });
});

export const EvaluationController = {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  unlockEvaluation,
  relockEvaluation,
};
