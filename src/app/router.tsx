import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { RequireAdmin } from "./RequireAdmin";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { ForbiddenPage } from "../features/auth/ForbiddenPage";
import { OverviewPage } from "../features/overview/OverviewPage";
import { FeaturePlaceholder } from "../features/FeaturePlaceholder";
import { RequesterQueuePage } from "../features/requesters/RequesterQueuePage";
import { TaskDraftQueuePage } from "../features/tasks/TaskDraftQueuePage";
import { SubmissionQueuePage } from "../features/submissions/SubmissionQueuePage";
import { PaymentQueuePage } from "../features/payments/PaymentQueuePage";
import { UsersSupportPage } from "../features/support/UsersSupportPage";
import { AuditLogPage } from "../features/audit/AuditLogPage";
import { AdminProfilePage } from "../features/profile/AdminProfilePage";
import { EmailComposerPage } from "../features/email/EmailComposerPage";
import { CampaignPage } from "../features/email/CampaignPage";
import { InboxPage } from "../features/inbox/InboxPage";
import { ToastProvider } from "./ToastProvider";
import { UNDER_DEVELOPMENT_MODE } from "../lib/underDevelopment";
import { UnderDevelopmentPage } from "../features/maintenance/UnderDevelopmentPage";

function ProtectedFeature({ title }: { title: string }) {
  return <RequireAdmin><AdminLayout><FeaturePlaceholder title={title} /></AdminLayout></RequireAdmin>;
}

function AdminApplicationRoutes() {
  if (UNDER_DEVELOPMENT_MODE) {
    return <UnderDevelopmentPage />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<RequireAdmin><AdminLayout><OverviewPage /></AdminLayout></RequireAdmin>} />
      <Route path="/requesters" element={<RequireAdmin><AdminLayout><RequesterQueuePage /></AdminLayout></RequireAdmin>} />
      <Route path="/tasks" element={<RequireAdmin><AdminLayout><TaskDraftQueuePage /></AdminLayout></RequireAdmin>} />
      <Route path="/submissions" element={<RequireAdmin><AdminLayout><SubmissionQueuePage /></AdminLayout></RequireAdmin>} />
      <Route path="/payments" element={<RequireAdmin><AdminLayout><PaymentQueuePage /></AdminLayout></RequireAdmin>} />
      <Route path="/users" element={<RequireAdmin><AdminLayout><UsersSupportPage /></AdminLayout></RequireAdmin>} />
      <Route path="/audit" element={<RequireAdmin><AdminLayout><AuditLogPage /></AdminLayout></RequireAdmin>} />
      <Route path="/profile" element={<RequireAdmin><AdminLayout><AdminProfilePage /></AdminLayout></RequireAdmin>} />
      <Route path="/email" element={<RequireAdmin><AdminLayout><EmailComposerPage /></AdminLayout></RequireAdmin>} />
      <Route path="/campaigns" element={<RequireAdmin><AdminLayout><CampaignPage /></AdminLayout></RequireAdmin>} />
      <Route path="/inbox" element={<RequireAdmin><AdminLayout><InboxPage /></AdminLayout></RequireAdmin>} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ToastProvider><AuthProvider>
        <AdminApplicationRoutes />
      </AuthProvider></ToastProvider>
    </BrowserRouter>
  );
}
