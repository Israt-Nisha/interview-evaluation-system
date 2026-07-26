export type TActivityLogQuery = {
  searchTerm?: string;
  action?: string;
  entityType?: string;
  actorId?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
