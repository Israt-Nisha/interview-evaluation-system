import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../sheard/catchAsync';
import { sendResponse } from '../../sheard/sendResponse';
import { UserService } from './user.service';

// ─── Create User ─────────────────────────────────────────────────────────────

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

// ─── Get All Users ────────────────────────────────────────────────────────────

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await UserService.getAllUsers(req.query as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Users fetched successfully!',
    data,
    meta,
  });
});

// ─── Get User By ID ───────────────────────────────────────────────────────────

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User fetched successfully!',
    data: result,
  });
});

// ─── Update User ──────────────────────────────────────────────────────────────

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUser(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

// ─── Update User Status ───────────────────────────────────────────────────────

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUserStatus(id as string, req.body);

  const actionLabel = result.isActive ? 'activated' : 'deactivated';

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `User ${actionLabel} successfully!`,
    data: result,
  });
});

// ─── Delete User (Soft Delete) ────────────────────────────────────────────────

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
};