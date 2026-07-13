import bcrypt from 'bcrypt';
import status from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { UserSearchableFields, UserSelectedFields } from './user.constant';
import { TCreateUser, TUpdateUser, TUpdateUserStatus, TUserQuery } from './user.interface';
import { Prisma } from '../../../generated/prisma/client';

// ─── Create User ────────────────────────────────────────────────────────────

const createUser = async (payload: TCreateUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError(status.CONFLICT, 'A user with this email already exists!');
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
    select: UserSelectedFields,
  });

  return user;
};

// ─── Get All Users ───────────────────────────────────────────────────────────

const getAllUsers = async (query: TUserQuery) => {
  const {
    searchTerm,
    role,
    isActive,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.UserWhereInput[] = [];

  // Keyword search across searchable fields
  if (searchTerm) {
    andConditions.push({
      OR: UserSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Role filter
  if (role) {
    andConditions.push({ role: role as any });
  }

  // isActive filter
  if (isActive !== undefined) {
    andConditions.push({ isActive: isActive === 'true' });
  }

  const where: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: UserSelectedFields,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limitNumber,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// ─── Get User By ID ──────────────────────────────────────────────────────────

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: UserSelectedFields,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }

  return user;
};

// ─── Update User ─────────────────────────────────────────────────────────────

const updateUser = async (id: string, payload: TUpdateUser) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }

  // Guard against email duplication
  if (payload.email && payload.email !== existingUser.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: payload.email } });
    if (emailTaken) {
      throw new AppError(status.CONFLICT, 'A user with this email already exists!');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: UserSelectedFields,
  });

  return updatedUser;
};

// ─── Update User Status (Activate / Deactivate) ──────────────────────────────

const updateUserStatus = async (id: string, payload: TUpdateUserStatus) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isActive: payload.isActive },
    select: UserSelectedFields,
  });

  return updatedUser;
};

// ─── Delete User (Soft Delete — deactivate) ──────────────────────────────────

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }

  // Soft delete: deactivate the user instead of hard deletion
  const deletedUser = await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: UserSelectedFields,
  });

  return deletedUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
};