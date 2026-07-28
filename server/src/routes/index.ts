import { Router } from 'express';
import { ActivityLogRoutes } from '../modules/ActivityLog/activityLog.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CandidateRoutes } from '../modules/Candidate/candidate.route';
import { DashboardRoutes } from '../modules/Dashboard/dashboard.route';
import { EvaluationRoutes } from '../modules/Evaluation/evaluation.route';
import { InterviewSessionRoutes } from '../modules/InterviewSession/interviewSession.route';
import { RubricCriterionRoutes } from '../modules/RubricCriterion/rubricCriterion.route';
import { UserRoutes } from '../modules/User/user.route';

type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/candidates',
    route: CandidateRoutes,
  },
  {
    path: '/interview-sessions',
    route: InterviewSessionRoutes,
  },
  {
    path: '/evaluations',
    route: EvaluationRoutes,
  },
  {
    path: '/rubric-criteria',
    route: RubricCriterionRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/activity-logs',
    route: ActivityLogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;