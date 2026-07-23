export const SessionSearchableFields = ['type', 'location', 'internalNotes'];

export const SessionFilterableFields = ['status', 'interviewerId', 'candidateId'];

export const SessionSelectedFields = {
  id: true,
  type: true,
  scheduledStart: true,
  scheduledEnd: true,
  meetingLink: true,
  location: true,
  internalNotes: true,
  status: true,
  candidateId: true,
  candidate: {
    select: {
      id: true,
      name: true,
      appliedPosition: true,
      stage: true,
    },
  },
  interviewerId: true,
  interviewer: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdById: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  evaluation: {
    select: {
      id: true,
      recommendation: true,
      submittedAt: true,
      lockedAt: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};
