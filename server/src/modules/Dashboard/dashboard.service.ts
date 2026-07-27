import { prisma } from '../../lib/prisma';

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalCandidates,
    totalSessions,
    totalEvaluations,
    pendingEvaluations,
    candidatesByStage,
    sessionsByStatus,
    recentActivityLogs,
  ] = await Promise.all([
    // Total counts
    prisma.user.count({ where: { isActive: true } }),
    prisma.candidate.count(),
    prisma.interviewSession.count(),
    prisma.evaluation.count({ where: { submittedAt: { not: null } } }),

    // Pending = sessions COMPLETED but have no evaluation yet
    prisma.interviewSession.count({
      where: {
        status: 'COMPLETED',
        evaluation: null,
      },
    }),

    // Candidates grouped by stage
    prisma.candidate.groupBy({
      by: ['stage'],
      _count: { id: true },
    }),

    // Sessions grouped by status
    prisma.interviewSession.groupBy({
      by: ['status'],
      _count: { id: true },
    }),

    // 10 most recent activity logs
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true,
        actor: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalCandidates,
    totalSessions,
    totalEvaluations,
    pendingEvaluations,
    candidatesByStage: candidatesByStage.map((g) => ({
      stage: g.stage,
      count: g._count.id,
    })),
    sessionsByStatus: sessionsByStatus.map((g) => ({
      status: g.status,
      count: g._count.id,
    })),
    recentActivityLogs,
  };
};

// ─── Recruiter Dashboard ──────────────────────────────────────────────────────

const getRecruiterDashboard = async () => {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalCandidates,
    candidatesByStage,
    upcomingSessions,
    pendingFeedback,
    recentCandidates,
  ] = await Promise.all([
    prisma.candidate.count(),

    // Pipeline breakdown by stage
    prisma.candidate.groupBy({
      by: ['stage'],
      _count: { id: true },
    }),

    // Upcoming sessions in the next 7 days
    prisma.interviewSession.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledStart: { gte: now, lte: in7Days },
      },
      orderBy: { scheduledStart: 'asc' },
      take: 10,
      select: {
        id: true,
        type: true,
        scheduledStart: true,
        scheduledEnd: true,
        status: true,
        candidate: { select: { id: true, name: true, appliedPosition: true } },
        interviewer: { select: { id: true, name: true, email: true } },
      },
    }),

    // Sessions completed but not yet evaluated
    prisma.interviewSession.count({
      where: {
        status: 'COMPLETED',
        evaluation: null,
      },
    }),

    // 5 most recently created candidates
    prisma.candidate.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        appliedPosition: true,
        stage: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalCandidates,
    candidatesByStage: candidatesByStage.map((g) => ({
      stage: g.stage,
      count: g._count.id,
    })),
    upcomingSessions,
    pendingFeedbackCount: pendingFeedback,
    recentCandidates,
  };
};

// ─── Interviewer Dashboard ────────────────────────────────────────────────────

const getInterviewerDashboard = async (interviewerId: string) => {
  const now = new Date();

  const [
    totalAssigned,
    upcomingSessions,
    pendingEvaluations,
    submittedEvaluations,
  ] = await Promise.all([
    // Total sessions assigned to this interviewer
    prisma.interviewSession.count({ where: { interviewerId } }),

    // Upcoming scheduled sessions
    prisma.interviewSession.findMany({
      where: {
        interviewerId,
        status: 'SCHEDULED',
        scheduledStart: { gte: now },
      },
      orderBy: { scheduledStart: 'asc' },
      take: 10,
      select: {
        id: true,
        type: true,
        scheduledStart: true,
        scheduledEnd: true,
        meetingLink: true,
        location: true,
        status: true,
        candidate: {
          select: { id: true, name: true, appliedPosition: true },
        },
      },
    }),

    // Completed sessions with no evaluation yet (pending)
    prisma.interviewSession.count({
      where: {
        interviewerId,
        status: 'COMPLETED',
        evaluation: null,
      },
    }),

    // Submitted evaluations by this interviewer
    prisma.evaluation.count({
      where: {
        authorId: interviewerId,
        submittedAt: { not: null },
      },
    }),
  ]);

  return {
    totalAssignedSessions: totalAssigned,
    upcomingSessions,
    pendingEvaluationsCount: pendingEvaluations,
    submittedEvaluationsCount: submittedEvaluations,
  };
};

export const DashboardService = {
  getAdminDashboard,
  getRecruiterDashboard,
  getInterviewerDashboard,
};
