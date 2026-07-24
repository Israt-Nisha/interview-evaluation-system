import status from 'http-status';
import { Prisma, Role } from '../../../generated/prisma/client';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { EvaluationSearchableFields, EvaluationSelectedFields } from './evaluation.constant';
import {
  TAuthUser,
  TCreateEvaluation,
  TEvaluationQuery,
  TUnlockEvaluation,
} from './evaluation.interface';

// ─── Create Evaluation (Submit) ───────────────────────────────────────────────

const createEvaluation = async (payload: TCreateEvaluation, authorId: string) => {
  const { sessionId, candidateId, recommendation, overallFeedback, scores } = payload;

  // Validate session exists
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) {
    throw new AppError(status.NOT_FOUND, 'Interview session not found!');
  }

  // Only the assigned interviewer can submit an evaluation
  if (session.interviewerId !== authorId) {
    throw new AppError(
      status.FORBIDDEN,
      'You can only submit evaluations for sessions assigned to you!',
    );
  }

  // Session must be completed before evaluation
  if (session.status !== 'COMPLETED') {
    throw new AppError(
      status.BAD_REQUEST,
      'You can only submit an evaluation for a completed interview session!',
    );
  }

  // Prevent duplicate evaluations
  const existingEvaluation = await prisma.evaluation.findUnique({ where: { sessionId } });
  if (existingEvaluation) {
    throw new AppError(status.CONFLICT, 'An evaluation for this session already exists!');
  }

  // Validate candidate exists
  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) {
    throw new AppError(status.NOT_FOUND, 'Candidate not found!');
  }

  // Validate all criteria IDs exist
  const criterionIds = scores.map((s) => s.criterionId);
  const criteria = await prisma.rubricCriterion.findMany({
    where: { id: { in: criterionIds }, isActive: true },
  });

  if (criteria.length !== criterionIds.length) {
    throw new AppError(status.BAD_REQUEST, 'One or more rubric criteria are invalid or inactive!');
  }

  const now = new Date();

  // Create evaluation with nested scores — auto-lock on submission
  const evaluation = await prisma.evaluation.create({
    data: {
      sessionId,
      candidateId,
      authorId,
      recommendation,
      overallFeedback,
      submittedAt: now,
      lockedAt: now,
      scores: {
        create: scores.map((s) => ({
          criterionId: s.criterionId,
          score: s.score,
          criterionNote: s.criterionNote,
        })),
      },
    },
    select: EvaluationSelectedFields,
  });

  return evaluation;
};

// ─── Get All Evaluations ──────────────────────────────────────────────────────

const getAllEvaluations = async (query: TEvaluationQuery) => {
  const {
    searchTerm,
    recommendation,
    candidateId,
    authorId,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.EvaluationWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: EvaluationSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' as Prisma.QueryMode },
      })),
    });
  }

  if (recommendation) {
    andConditions.push({ recommendation: recommendation as any });
  }

  if (candidateId) {
    andConditions.push({ candidateId });
  }

  if (authorId) {
    andConditions.push({ authorId });
  }

  const where: Prisma.EvaluationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [evaluations, total] = await Promise.all([
    prisma.evaluation.findMany({
      where,
      select: EvaluationSelectedFields,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limitNumber,
    }),
    prisma.evaluation.count({ where }),
  ]);

  return {
    data: evaluations,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// ─── Get Evaluation By ID ─────────────────────────────────────────────────────

const getEvaluationById = async (id: string, authUser: TAuthUser) => {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    select: EvaluationSelectedFields,
  });

  if (!evaluation) {
    throw new AppError(status.NOT_FOUND, 'Evaluation not found!');
  }

  // Interviewers can only see their own evaluations
  if (authUser.role === Role.INTERVIEWER && evaluation.authorId !== authUser.userId) {
    throw new AppError(status.FORBIDDEN, 'You do not have permission to access this evaluation!');
  }

  return evaluation;
};

// ─── Unlock Evaluation (Admin only) ──────────────────────────────────────────

const unlockEvaluation = async (
  id: string,
  adminId: string,
  payload: TUnlockEvaluation,
) => {
  const evaluation = await prisma.evaluation.findUnique({ where: { id } });

  if (!evaluation) {
    throw new AppError(status.NOT_FOUND, 'Evaluation not found!');
  }

  if (!evaluation.lockedAt) {
    throw new AppError(status.BAD_REQUEST, 'This evaluation is not currently locked!');
  }

  const updatedEvaluation = await prisma.evaluation.update({
    where: { id },
    data: {
      lockedAt: null,
      unlockedAt: new Date(),
      unlockedById: adminId,
      unlockReason: payload.unlockReason,
    },
    select: EvaluationSelectedFields,
  });

  return updatedEvaluation;
};

// ─── Re-lock Evaluation (Admin only) ─────────────────────────────────────────

const relockEvaluation = async (id: string) => {
  const evaluation = await prisma.evaluation.findUnique({ where: { id } });

  if (!evaluation) {
    throw new AppError(status.NOT_FOUND, 'Evaluation not found!');
  }

  if (evaluation.lockedAt) {
    throw new AppError(status.BAD_REQUEST, 'This evaluation is already locked!');
  }

  const updatedEvaluation = await prisma.evaluation.update({
    where: { id },
    data: {
      lockedAt: new Date(),
    },
    select: EvaluationSelectedFields,
  });

  return updatedEvaluation;
};

export const EvaluationService = {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  unlockEvaluation,
  relockEvaluation,
};
