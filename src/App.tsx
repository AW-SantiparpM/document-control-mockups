import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DocumentListPage from "./pages/DocumentControl/DocumentListPage";
import DocumentDetailPage from "./pages/DocumentControl/DocumentDetailPage";
import NewDocumentRequestPage from "./pages/DocumentControl/NewDocumentRequestPage";
import AuditPlanPage from "./pages/InternalAudit/AuditPlanPage";
import AuditChecklistPage from "./pages/InternalAudit/AuditChecklistPage";
import AuditReportPage from "./pages/InternalAudit/AuditReportPage";
import CarParTrackingPage from "./pages/InternalAudit/CarParTrackingPage";
import FormsListPage from "./pages/PaperlessForms/FormsListPage";
import FormFillPage from "./pages/PaperlessForms/FormFillPage";
import ScanInboxPage from "./pages/ScannedDocs/ScanInboxPage";
import ScanDetailPage from "./pages/ScannedDocs/ScanDetailPage";
import DashboardPage from "./pages/ReportsDashboards/DashboardPage";
import ReportsPage from "./pages/ReportsDashboards/ReportsPage";
import NotificationsCenterPage from "./pages/Notifications/NotificationsCenterPage";
import { NotificationProvider } from "./context/NotificationContext";
import ProductRequestListPage from "./pages/ProductRequests/ProductRequestListPage";
import ProductRequestEditPage from "./pages/ProductRequests/ProductRequestEditPage"; // create/edit product requisitions
import ApprovalsListPage from "./pages/Approvals/ApprovalsListPage";
import ApprovalDetailPage from "./pages/Approvals/ApprovalDetailPage";

export default function App() {
  return (
    <NotificationProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route
            path="/documents/new-request"
            element={<NewDocumentRequestPage />}
          />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/audit/plan" element={<AuditPlanPage />} />
          <Route
            path="/audit/checklists/:id"
            element={<AuditChecklistPage />}
          />
          <Route path="/audit/reports/:id" element={<AuditReportPage />} />
          <Route path="/audit/car-par" element={<CarParTrackingPage />} />
          <Route path="/forms" element={<FormsListPage />} />
          <Route path="/forms/:id/fill" element={<FormFillPage />} />
          <Route path="/scans" element={<ScanInboxPage />} />
          <Route path="/scans/:id" element={<ScanDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsCenterPage />} />
          {/* Product Requests (New Product Requisition) */}
          <Route path="/products" element={<ProductRequestListPage />} />
          <Route
            path="/products/new"
            element={<ProductRequestEditPage mode="create" />}
          />
          <Route
            path="/products/:id"
            element={<ProductRequestEditPage mode="edit" />}
          />
          {/* Approvals */}
          <Route path="/approvals" element={<ApprovalsListPage />} />
          <Route path="/approvals/:id" element={<ApprovalDetailPage />} />
        </Routes>
      </Layout>
    </NotificationProvider>
  );
}
