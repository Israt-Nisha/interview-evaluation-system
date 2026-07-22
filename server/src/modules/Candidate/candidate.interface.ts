import { z } from 'zod';
import { CandidateValidation } from './candidate.validation';

export type TCreateCandidate = z.infer<typeof CandidateValidation.createCandidateValidationSchema>['body'];
export type TUpdateCandidate = z.infer<typeof CandidateValidation.updateCandidateValidationSchema>['body'];
export type TUpdateCandidateStage = z.infer<typeof CandidateValidation.updateCandidateStageValidationSchema>['body'];

export type TCandidateQuery = {
  searchTerm?: string;
  stage?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
