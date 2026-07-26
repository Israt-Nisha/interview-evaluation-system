export const ActivityLogSearchableFields = ['action', 'entityType', 'entityId'];

export const ActivityLogFilterableFields = ['action', 'entityType', 'actorId'];

export const ActivityLogSelectedFields = {
  id: true,
  actorId: true,
  actor: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  action: true,
  entityType: true,
  entityId: true,
  metadata: true,
  requestId: true,
  createdAt: true,
};
