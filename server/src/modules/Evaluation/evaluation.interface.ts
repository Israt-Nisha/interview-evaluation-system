import { z } from 'zod';
import { EvaluationValidation } from './evaluation.validation';

export type TCreateEvaluation = z.infer<typeof EvaluationValidation.createEvaluationValidationSchema>['body'];
export type TUnlockEvaluation = z.infer<typeof EvaluationValidation.unlockEvaluationValidationSchema>['body'];

export type TEvaluationQuery = {
  searchTerm?: string;
  recommendation?: string;
  candidateId?: string;
  authorId?: string;
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
