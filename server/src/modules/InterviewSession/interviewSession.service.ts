import status from 'http-status';
import { Prisma, Role } from '../../../generated/prisma/client';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { SessionSearchableFields, SessionSelectedFields } from './interviewSession.constant';
import {
  TAuthUser,
  TCreateSession,
  TSessionQuery,
  TUpdateSession,
  TUpdateSessionStatus,
} from './interviewSession.interface';

// ─── Create Interview Session ─────────────────────────────────────────────────

const createSession = async (payload: TCreateSession, createdById: string) => {
  const { candidateId, interviewerId, ...rest } = payload;

  // Validate candidate exists
  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) {
    throw new AppError(status.NOT_FOUND, 'Candidate not found!');
  }

  // Validate interviewer exists and has INTERVIEWER role
  const interviewer = await prisma.user.findUnique({ where: { id: interviewerId } });
  if (!interviewer) {
    throw new AppError(status.NOT_FOUND, 'Interviewer not found!');
  }
  if (interviewer.role !== Role.INTERVIEWER) {
    throw new AppError(status.BAD_REQUEST, 'Assigned user must have the INTERVIEWER role!');
  }
  if (!interviewer.isActive) {
    throw new AppError(status.BAD_REQUEST, 'Cannot assign a deactivated user as interviewer!');
  }

  const session = await prisma.interviewSession.create({
    data: {
      candidateId,
      interviewerId,
      createdById,
      ...rest,
    },
    select: SessionSelectedFields,
  });

  return session;
};

// ─── Get All Interview Sessions ───────────────────────────────────────────────

const getAllSessions = async (query: TSessionQuery, authUser: TAuthUser) => {
  const {
    searchTerm,
    status: statusFilter,
    interviewerId,
    candidateId,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.InterviewSessionWhereInput[] = [];

  // Interviewers can only see their assigned sessions
  if (authUser.role === Role.INTERVIEWER) {
    andConditions.push({ interviewerId: authUser.userId });
  }

  if (searchTerm) {
    andConditions.push({
      OR: SessionSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' as Prisma.QueryMode },
      })),
    });
  }

  if (statusFilter) {
    andConditions.push({ status: statusFilter as any });
  }

  if (interviewerId && authUser.role !== Role.INTERVIEWER) {
    andConditions.push({ interviewerId });
  }

  if (candidateId) {
    andConditions.push({ candidateId });
  }

  const where: Prisma.InterviewSessionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [sessions, total] = await Promise.all([
    prisma.interviewSession.findMany({
      where,
      select: SessionSelectedFields,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limitNumber,
    }),
    prisma.interviewSession.count({ where }),
  ]);

  return {
    data: sessions,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// ─── Get Session By ID ────────────────────────────────────────────────────────

const getSessionById = async (id: string, authUser: TAuthUser) => {
  const session = await prisma.interviewSession.findUnique({
    where: { id },
    select: SessionSelectedFields,
  });

  if (!session) {
    throw new AppError(status.NOT_FOUND, 'Interview session not found!');
  }

  // Interviewers can only access their own sessions
  if (authUser.role === Role.INTERVIEWER && session.interviewerId !== authUser.userId) {
    throw new AppError(status.FORBIDDEN, 'You do not have permission to access this session!');
  }

  return session;
};

// ─── Update Interview Session ─────────────────────────────────────────────────

const updateSession = async (id: string, payload: TUpdateSession) => {
  const existingSession = await prisma.interviewSession.findUnique({ where: { id } });

  if (!existingSession) {
    throw new AppError(status.NOT_FOUND, 'Interview session not found!');
  }

  if (existingSession.status === 'COMPLETED' || existingSession.status === 'CANCELLED') {
    throw new AppError(
      status.BAD_REQUEST,
      `Cannot update a session that is already ${existingSession.status.toLowerCase()}!`,
    );
  }

  // Validate interviewer if changing
  if (payload.interviewerId) {
    const interviewer = await prisma.user.findUnique({ where: { id: payload.interviewerId } });
    if (!interviewer) {
      throw new AppError(status.NOT_FOUND, 'Interviewer not found!');
    }
    if (interviewer.role !== Role.INTERVIEWER) {
      throw new AppError(status.BAD_REQUEST, 'Assigned user must have the INTERVIEWER role!');
    }
    if (!interviewer.isActive) {
      throw new AppError(status.BAD_REQUEST, 'Cannot assign a deactivated user as interviewer!');
    }
  }

  const updatedSession = await prisma.interviewSession.update({
    where: { id },
    data: payload,
    select: SessionSelectedFields,
  });

  return updatedSession;
};

// ─── Update Session Status ────────────────────────────────────────────────────

const updateSessionStatus = async (id: string, payload: TUpdateSessionStatus) => {
  const existingSession = await prisma.interviewSession.findUnique({ where: { id } });

  if (!existingSession) {
    throw new AppError(status.NOT_FOUND, 'Interview session not found!');
  }

  if (existingSession.status === 'CANCELLED') {
    throw new AppError(status.BAD_REQUEST, 'Cannot update status of a cancelled session!');
  }

  const updatedSession = await prisma.interviewSession.update({
    where: { id },
    data: { status: payload.status },
    select: SessionSelectedFields,
  });

  return updatedSession;
};

// ─── Delete Interview Session ─────────────────────────────────────────────────

const deleteSession = async (id: string) => {
  const existingSession = await prisma.interviewSession.findUnique({ where: { id } });

  if (!existingSession) {
    throw new AppError(status.NOT_FOUND, 'Interview session not found!');
  }

  if (existingSession.status === 'COMPLETED') {
    throw new AppError(status.BAD_REQUEST, 'Cannot delete a completed interview session!');
  }

  const deletedSession = await prisma.interviewSession.delete({
    where: { id },
    select: SessionSelectedFields,
  });

  return deletedSession;
};

export const InterviewSessionService = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  updateSessionStatus,
  deleteSession,
};
