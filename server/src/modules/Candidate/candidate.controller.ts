import { Request, Response } from 'express';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { CandidateService } from './candidate.service';

// ─── Create Candidate ─────────────────────────────────────────────────────────

const createCandidate = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, 'You are not authenticated!');
  }

  const result = await CandidateService.createCandidate(req.body, req.user.userId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Candidate created successfully!',
    data: result,
  });
});

// ─── Get All Candidates ───────────────────────────────────────────────────────

const getAllCandidates = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await CandidateService.getAllCandidates(req.query as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Candidates fetched successfully!',
    data,
    meta,
  });
});

// ─── Get Candidate By ID ──────────────────────────────────────────────────────

const getCandidateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CandidateService.getCandidateById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Candidate fetched successfully!',
    data: result,
  });
});

// ─── Update Candidate ─────────────────────────────────────────────────────────

const updateCandidate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CandidateService.updateCandidate(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Candidate updated successfully!',
    data: result,
  });
});

// ─── Update Candidate Stage ───────────────────────────────────────────────────

const updateCandidateStage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CandidateService.updateCandidateStage(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Candidate stage updated successfully!',
    data: result,
  });
});

// ─── Delete Candidate ─────────────────────────────────────────────────────────

const deleteCandidate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CandidateService.deleteCandidate(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Candidate deleted successfully!',
    data: result,
  });
});

export const CandidateController = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStage,
  deleteCandidate,
};
