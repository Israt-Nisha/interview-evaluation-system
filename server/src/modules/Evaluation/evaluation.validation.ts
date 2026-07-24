import { z } from 'zod';
import { Recommendation } from '../../../generated/prisma/client';

const evaluationScoreSchema = z.object({
  criterionId: z
    .string({ message: 'Criterion ID is required' })
    .uuid('Invalid criterion ID format'),
  score: z
    .number({ message: 'Score is required' })
    .int('Score must be an integer')
    .min(1, 'Score must be at least 1')
    .max(5, 'Score must be at most 5'),
  criterionNote: z.string().optional(),
});

const createEvaluationValidationSchema = z.object({
  body: z.object({
    sessionId: z
      .string({ message: 'Session ID is required' })
      .uuid('Invalid session ID format'),
    candidateId: z
      .string({ message: 'Candidate ID is required' })
      .uuid('Invalid candidate ID format'),
    recommendation: z.nativeEnum(Recommendation, {
      message: 'Recommendation must be one of: STRONG_YES, YES, NO, STRONG_NO',
    }),
    overallFeedback: z
      .string({ message: 'Overall feedback is required' })
      .min(1, 'Overall feedback cannot be empty'),
    scores: z
      .array(evaluationScoreSchema, { message: 'Scores are required' })
      .min(1, 'At least one score is required'),
  }),
});

const unlockEvaluationValidationSchema = z.object({
  body: z.object({
    unlockReason: z
      .string({ message: 'Unlock reason is required' })
      .min(1, 'Unlock reason cannot be empty'),
  }),
});

export const EvaluationValidation = {
  createEvaluationValidationSchema,
  unlockEvaluationValidationSchema,
};
