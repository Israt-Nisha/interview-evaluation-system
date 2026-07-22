import { z } from 'zod';
import { RecruitmentStage } from '../../../generated/prisma/client';

const createCandidateValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(1, 'Name cannot be empty'),
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address'),
    phone: z.string().optional(),
    appliedPosition: z
      .string({ message: 'Applied position is required' })
      .min(1, 'Applied position cannot be empty'),
    resumeUrl: z.string().url('Invalid resume URL').optional(),
    candidateSource: z.string().optional(),
  }),
});

const updateCandidateValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    appliedPosition: z.string().min(1, 'Applied position cannot be empty').optional(),
    resumeUrl: z.string().url('Invalid resume URL').optional(),
    candidateSource: z.string().optional(),
  }),
});

const updateCandidateStageValidationSchema = z.object({
  body: z.object({
    stage: z.nativeEnum(RecruitmentStage, {
      message: 'Stage must be one of: APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED',
    }),
  }),
});

export const CandidateValidation = {
  createCandidateValidationSchema,
  updateCandidateValidationSchema,
  updateCandidateStageValidationSchema,
};
