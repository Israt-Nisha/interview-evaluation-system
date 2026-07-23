import { z } from 'zod';
import { SessionStatus } from '../../../generated/prisma/client';

const createSessionValidationSchema = z.object({
  body: z
    .object({
      candidateId: z
        .string({ message: 'Candidate ID is required' })
        .uuid('Invalid candidate ID format'),
      interviewerId: z
        .string({ message: 'Interviewer ID is required' })
        .uuid('Invalid interviewer ID format'),
      type: z
        .string({ message: 'Interview type is required' })
        .min(1, 'Interview type cannot be empty'),
      scheduledStart: z.coerce.date({
        message: 'Scheduled start must be a valid date',
      }),
      scheduledEnd: z.coerce.date({
        message: 'Scheduled end must be a valid date',
      }),
      meetingLink: z.string().url('Invalid meeting link URL').optional(),
      location: z.string().optional(),
      internalNotes: z.string().optional(),
    })
    .refine((data) => data.scheduledEnd > data.scheduledStart, {
      message: 'Scheduled end must be after scheduled start',
      path: ['scheduledEnd'],
    }),
});

const updateSessionValidationSchema = z.object({
  body: z
    .object({
      interviewerId: z.string().uuid('Invalid interviewer ID format').optional(),
      type: z.string().min(1, 'Interview type cannot be empty').optional(),
      scheduledStart: z.coerce.date().optional(),
      scheduledEnd: z.coerce.date().optional(),
      meetingLink: z.string().url('Invalid meeting link URL').optional(),
      location: z.string().optional(),
      internalNotes: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.scheduledStart && data.scheduledEnd) {
          return data.scheduledEnd > data.scheduledStart;
        }
        return true;
      },
      {
        message: 'Scheduled end must be after scheduled start',
        path: ['scheduledEnd'],
      },
    ),
});

const updateSessionStatusValidationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(SessionStatus, {
      message: 'Status must be one of: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW',
    }),
  }),
});

export const InterviewSessionValidation = {
  createSessionValidationSchema,
  updateSessionValidationSchema,
  updateSessionStatusValidationSchema,
};
