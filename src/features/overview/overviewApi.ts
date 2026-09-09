import { invokeAdminFunction } from "../../lib/adminApi";
import type { DateRange } from "./dateRange";

export interface OverviewMetrics {
  range: DateRange;
  newUsers: number;
  activeUsers: number;
  tasksStarted: number;
  tasksSubmitted: number;
  tasksApproved: number;
  tasksRejected: number;
  completionRate: number;
  pendingRequesterApplications: number;
  taskDraftsAwaitingReview: number;
  verificationDepositsAwaitingAction: number;
  payoutsAwaitingAction: number;
  openProfileAppeals: number;
  unreadContactMessages: number;
  gradingQueueDepth: number;
  failedGradingJobs: number;
  rewardsApproved: number;
  rewardsPaid: number;
}

export function fetchOverviewMetrics(range: DateRange): Promise<OverviewMetrics> {
  return invokeAdminFunction<OverviewMetrics>("admin-overview-metrics", { dateFrom: range.from, dateTo: range.to });
}
