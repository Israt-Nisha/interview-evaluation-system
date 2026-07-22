export const CandidateSearchableFields = ['name', 'email', 'appliedPosition', 'candidateSource'];

export const CandidateFilterableFields = ['stage'];

export const CandidateSelectedFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  appliedPosition: true,
  resumeUrl: true,
  candidateSource: true,
  stage: true,
  createdByUserId: true,
  createdByUser: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};
