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

function ProtectedFeature({ title }: { title: string }) {
  return <RequireAdmin><AdminLayout><FeaturePlaceholder title={title} /></AdminLayout></RequireAdmin>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
