import React from "react";
import audits from "../../data/audits.json";
import { Link } from "react-router-dom";

export default function AuditPlanPage() {
  const plan = (audits as any).plans;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateRange = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return `${fromDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${toDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Annual Audit Calendar Planner {(audits as any).planYear}
        </h1>
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          disabled
        >
          Add Plan
        </button>
      </header>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audit No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audit Area
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Planned Dates
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auditor(s)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Standard
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plan.map((p: any, index: number) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {p.area}
                  </div>
                  <div className="text-xs text-primary-600 font-medium">
                    {p.standard}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.department}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.frequency}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateRange(p.schedule.from, p.schedule.to)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="space-y-2">
                    {p.auditors.map((auditor: any) => (
                      <div
                        key={auditor.userId}
                        className="border rounded-md p-2 bg-gray-50"
                      >
                        <div className="font-medium text-xs">
                          {auditor.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          <div>
                            <strong>Area:</strong> {auditor.assignment.area}
                          </div>
                          <div>
                            <strong>Zone:</strong> {auditor.assignment.zone}
                          </div>
                          <div className="mt-1">
                            <div>
                              <strong>From:</strong>{" "}
                              {formatDateTime(auditor.assignment.dateFrom)}
                            </div>
                            <div>
                              <strong>To:</strong>{" "}
                              {formatDateTime(auditor.assignment.dateTo)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs">
                    <div className="text-xs">{p.remarks}</div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/audit/checklists/${p.checklists[0].id}`}
                        className="text-primary-600 hover:underline text-xs"
                      >
                        Checklist
                      </Link>
                      <Link
                        to={`/audit/reports/${p.reports[0].id}`}
                        className="text-primary-600 hover:underline text-xs"
                      >
                        Report
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Audits</div>
          <div className="text-2xl font-bold text-gray-900">{plan.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="text-2xl font-bold text-gray-900">
            {plan.filter((p: any) => p.status === "In Progress").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">Planned</div>
          <div className="text-2xl font-bold text-gray-900">
            {plan.filter((p: any) => p.status === "Planned").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="text-sm font-medium text-gray-500">Not Started</div>
          <div className="text-2xl font-bold text-gray-900">
            {plan.filter((p: any) => p.status === "Not Started").length}
          </div>
        </div>
      </div>
    </div>
  );
}
