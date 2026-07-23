import { Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { InterviewSessionService } from './interviewSession.service';

// ─── Create Interview Session ─────────────────────────────────────────────────

const createSession = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const result = await InterviewSessionService.createSession(req.body, req.user.userId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Interview session scheduled successfully!',
    data: result,
  });
});

// ─── Get All Interview Sessions ───────────────────────────────────────────────

const getAllSessions = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const { data, meta } = await InterviewSessionService.getAllSessions(
    req.query as any,
    req.user,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Interview sessions fetched successfully!',
    data,
    meta,
  });
});

// ─── Get Interview Session By ID ──────────────────────────────────────────────

const getSessionById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const { id } = req.params;
  const result = await InterviewSessionService.getSessionById(id as string, req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Interview session fetched successfully!',
    data: result,
  });
});

// ─── Update Interview Session ─────────────────────────────────────────────────

const updateSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InterviewSessionService.updateSession(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Interview session updated successfully!',
    data: result,
  });
});

// ─── Update Session Status ────────────────────────────────────────────────────

const updateSessionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InterviewSessionService.updateSessionStatus(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Interview session status updated successfully!',
    data: result,
  });
});

// ─── Delete Interview Session ─────────────────────────────────────────────────

const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InterviewSessionService.deleteSession(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Interview session deleted successfully!',
    data: result,
  });
});

export const InterviewSessionController = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  updateSessionStatus,
  deleteSession,
};
