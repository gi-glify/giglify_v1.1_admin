import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { RequireAdmin } from "./RequireAdmin";
import { AdminLayout } from "../components/layout/AdminLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { ForbiddenPage } from "../features/auth/ForbiddenPage";
import { OverviewPage } from "../features/overview/OverviewPage";
import { FeaturePlaceholder } from "../features/FeaturePlaceholder";

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
          <Route path="/requesters" element={<ProtectedFeature title="Requester applications" />} />
          <Route path="/tasks" element={<ProtectedFeature title="Task drafts" />} />
          <Route path="/submissions" element={<ProtectedFeature title="Submissions & grading" />} />
          <Route path="/payments" element={<ProtectedFeature title="Payments & payouts" />} />
          <Route path="/users" element={<ProtectedFeature title="Users & support" />} />
          <Route path="/audit" element={<ProtectedFeature title="Audit log" />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
