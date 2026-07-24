export const EvaluationSearchableFields = ['overallFeedback'];

export const EvaluationFilterableFields = ['recommendation', 'candidateId', 'authorId'];

export const EvaluationSelectedFields = {
  id: true,
  sessionId: true,
  session: {
    select: {
      id: true,
      type: true,
      scheduledStart: true,
      scheduledEnd: true,
      status: true,
    },
  },
  candidateId: true,
  candidate: {
    select: {
      id: true,
      name: true,
      appliedPosition: true,
      stage: true,
    },
  },
  authorId: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  recommendation: true,
  overallFeedback: true,
  submittedAt: true,
  lockedAt: true,
  unlockedAt: true,
  unlockedById: true,
  unlockedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  unlockReason: true,
  scores: {
    select: {
      id: true,
      score: true,
      criterionNote: true,
      criterionId: true,
      criterion: {
        select: {
          id: true,
          key: true,
          label: true,
          description: true,
          displayOrder: true,
        },
      },
    },
    orderBy: {
      criterion: { displayOrder: 'asc' as const },
    },
  },
  createdAt: true,
  updatedAt: true,
};
