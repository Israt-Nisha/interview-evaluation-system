import { z } from 'zod';
import { InterviewSessionValidation } from './interviewSession.validation';

export type TCreateSession = z.infer<typeof InterviewSessionValidation.createSessionValidationSchema>['body'];
export type TUpdateSession = z.infer<typeof InterviewSessionValidation.updateSessionValidationSchema>['body'];
export type TUpdateSessionStatus = z.infer<typeof InterviewSessionValidation.updateSessionStatusValidationSchema>['body'];

export type TSessionQuery = {
  searchTerm?: string;
  status?: string;
  interviewerId?: string;
  candidateId?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type TAuthUser = {
  userId: string;
  email: string;
  role: string;
};
