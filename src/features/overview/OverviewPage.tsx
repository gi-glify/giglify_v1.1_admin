import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminApiError } from "../../lib/errors";
import { DateRangePicker } from "./DateRangePicker";
import { getDefaultDateRange, validateDateRange, type DateRange } from "./dateRange";
import { fetchOverviewMetrics, type OverviewMetrics } from "./overviewApi";
import { MetricCard } from "./MetricCard";

function money(value: number): string { return `$${value.toFixed(2)}`; }

export function OverviewPage() {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange>(() => getDefaultDateRange());
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const rangeError = useMemo(() => validateDateRange(range), [range]);

  useEffect(() => {
    if (rangeError) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    setError(null);
    fetchOverviewMetrics(range)
      .then((next) => {
        if (!active) return;
        setMetrics(next);
        setLastUpdated(new Date());
      })
      .catch((nextError: unknown) => {
        if (!active) return;
        setError(nextError instanceof AdminApiError ? nextError.message : "Unable to load overview metrics.");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [range, rangeError]);

  const cards = metrics ? [
    ["New users", metrics.newUsers.toLocaleString(), "User directory", "/users"],
    ["Active users", metrics.activeUsers.toLocaleString(), "User activity", "/users"],
    ["Tasks submitted", metrics.tasksSubmitted.toLocaleString(), "Submission queue", "/submissions"],
    ["Completion rate", `${metrics.completionRate.toFixed(1)}%`, "Task funnel", "/submissions"],
    ["Pending requesters", metrics.pendingRequesterApplications.toLocaleString(), "Requester queue", "/requesters?status=review-ready"],
    ["Drafts awaiting review", metrics.taskDraftsAwaitingReview.toLocaleString(), "Task queue", "/tasks?status=pending_review"],
    ["Deposits awaiting action", metrics.verificationDepositsAwaitingAction.toLocaleString(), "Verification queue", "/payments?queue=deposits"],
    ["Payouts awaiting action", metrics.payoutsAwaitingAction.toLocaleString(), "Payout queue", "/payments?queue=payouts"],
    ["Open profile appeals", metrics.openProfileAppeals.toLocaleString(), "Appeal queue", "/users?view=appeals"],
    ["Unread contact messages", metrics.unreadContactMessages.toLocaleString(), "Support queue", "/users?view=messages"],
    ["Grading queue depth", metrics.gradingQueueDepth.toLocaleString(), "Grading queue", "/submissions?status=queued"],
    ["Failed grading jobs", metrics.failedGradingJobs.toLocaleString(), "Retry queue", "/submissions?status=failed"],
    ["Rewards approved", money(metrics.rewardsApproved), "Approved rewards", "/submissions?status=approved"],
    ["Rewards paid", money(metrics.rewardsPaid), "Paid rewards", "/payments?queue=rewards"],
  ] : [];

  return (
    <>
      <section className="hero-card" data-aos="fade-up">
        <div>
          <p className="eyebrow">Today’s command centre</p>
          <h3>Keep the work moving.</h3>
          <p>Operational numbers are aggregated server-side and filtered to the selected date range.</p>
        </div>
        <DateRangePicker range={range} error={rangeError} onChange={setRange} />
      </section>

      {error && <div className={metrics ? "alert alert-warning stale-banner" : "alert alert-error"} role="alert">
        <span>{metrics ? `Showing the last successful result. ${error}` : error}</span>
        <button className="text-button" onClick={() => setRange({ ...range })}>Retry</button>
      </div>}
      {loading && !metrics && <div className="loading-card overview-loading">Loading operational metrics…</div>}
      {!loading && !error && !metrics && <div className="empty-state"><h3>No metrics available</h3><p>The selected range returned no operational data.</p></div>}
      {metrics && <section className="metric-grid" aria-label="Operational metrics" data-aos="fade-up" data-aos-delay="60">
        {cards.map(([label, value, detail, href]) => <MetricCard key={label} label={label} value={value} detail={detail} href={href} onClick={(target) => navigate(target)} />)}
      </section>}
      <p className="last-updated">{lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : "Waiting for the first metrics response"}</p>
    </>
  );
}
