import { prisma } from '../../lib/prisma';
import { ActivityLogSearchableFields, ActivityLogSelectedFields } from './activityLog.constant';
import { TActivityLogQuery } from './activityLog.interface';
import { Prisma } from '../../../generated/prisma/client';
import AppError from '../../errors/AppError';
import status from 'http-status';

// ─── Get All Activity Logs ────────────────────────────────────────────────────

const getAllActivityLogs = async (query: TActivityLogQuery) => {
  const {
    searchTerm,
    action,
    entityType,
    actorId,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.ActivityLogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ActivityLogSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' as Prisma.QueryMode },
      })),
    });
  }

  if (action) {
    andConditions.push({ action: { contains: action, mode: 'insensitive' } });
  }

  if (entityType) {
    andConditions.push({ entityType: { contains: entityType, mode: 'insensitive' } });
  }

  if (actorId) {
    andConditions.push({ actorId });
  }

  const where: Prisma.ActivityLogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      select: ActivityLogSelectedFields,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limitNumber,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    data: logs,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// ─── Get Activity Log By ID ───────────────────────────────────────────────────

const getActivityLogById = async (id: string) => {
  const log = await prisma.activityLog.findUnique({
    where: { id },
    select: ActivityLogSelectedFields,
  });

  if (!log) {
    throw new AppError(status.NOT_FOUND, 'Activity log not found!');
  }

  return log;
};

export const ActivityLogService = {
  getAllActivityLogs,
  getActivityLogById,
};
