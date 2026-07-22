import status from 'http-status';
import { Prisma } from '../../../generated/prisma/client';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { CandidateSearchableFields, CandidateSelectedFields } from './candidate.constant';
import { TCandidateQuery, TCreateCandidate, TUpdateCandidate, TUpdateCandidateStage } from './candidate.interface';

// ─── Create Candidate ────────────────────────────────────────────────────────

const createCandidate = async (payload: TCreateCandidate, createdByUserId: string) => {
  const candidate = await prisma.candidate.create({
    data: {
      ...payload,
      createdByUserId,
    },
    select: CandidateSelectedFields,
  });

  return candidate;
};

// ─── Get All Candidates ──────────────────────────────────────────────────────

const getAllCandidates = async (query: TCandidateQuery) => {
  const {
    searchTerm,
    stage,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.CandidateWhereInput[] = [];

  // Keyword search across searchable fields
  if (searchTerm) {
    andConditions.push({
      OR: CandidateSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' as Prisma.QueryMode },
      })),
    });
  }

  // Stage filter
  if (stage) {
    andConditions.push({ stage: stage as any });
  }

  const where: Prisma.CandidateWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      where,
      select: CandidateSelectedFields,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limitNumber,
    }),
    prisma.candidate.count({ where }),
  ]);

  return {
    data: candidates,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// ─── Get Candidate By ID ─────────────────────────────────────────────────────

const getCandidateById = async (id: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    select: CandidateSelectedFields,
  });

  if (!candidate) {
    throw new AppError(status.NOT_FOUND, 'Candidate not found!');
  }

  return candidate;
};

// ─── Update Candidate ────────────────────────────────────────────────────────

const updateCandidate = async (id: string, payload: TUpdateCandidate) => {
  const existingCandidate = await prisma.candidate.findUnique({ where: { id } });

  if (!existingCandidate) {
    throw new AppError(status.NOT_FOUND, 'Candidate not found!');
  }

  const updatedCandidate = await prisma.candidate.update({
    where: { id },
    data: payload,
    select: CandidateSelectedFields,
  });

  return updatedCandidate;
};

// ─── Update Candidate Stage ──────────────────────────────────────────────────

const updateCandidateStage = async (id: string, payload: TUpdateCandidateStage) => {
  const existingCandidate = await prisma.candidate.findUnique({ where: { id } });

  if (!existingCandidate) {
    throw new AppError(status.NOT_FOUND, 'Candidate not found!');
  }

  const updatedCandidate = await prisma.candidate.update({
    where: { id },
    data: { stage: payload.stage },
    select: CandidateSelectedFields,
  });

  return updatedCandidate;
};

// ─── Delete Candidate ────────────────────────────────────────────────────────

const deleteCandidate = async (id: string) => {
  const existingCandidate = await prisma.candidate.findUnique({ where: { id } });

  if (!existingCandidate) {
    throw new AppError(status.NOT_FOUND, 'Candidate not found!');
  }

  // Hard delete — cascade removes related sessions and evaluations
  const deletedCandidate = await prisma.candidate.delete({
    where: { id },
    select: CandidateSelectedFields,
  });

  return deletedCandidate;
};

export const CandidateService = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStage,
  deleteCandidate,
};
