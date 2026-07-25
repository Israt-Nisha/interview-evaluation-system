import { prisma } from '../../lib/prisma';
import { RubricCriterionSelectedFields } from './rubricCriterion.constant';

// ─── Get All Rubric Criteria ──────────────────────────────────────────────────

const getAllCriteria = async () => {
  const criteria = await prisma.rubricCriterion.findMany({
    where: { isActive: true },
    select: RubricCriterionSelectedFields,
    orderBy: { displayOrder: 'asc' },
  });

  return criteria;
};

export const RubricCriterionService = {
  getAllCriteria,
};
