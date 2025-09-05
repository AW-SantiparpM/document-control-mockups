import React, { useEffect, useState } from "react";
import audits from "../../data/audits.json";
import { Link } from "react-router-dom";

const STORAGE_KEY = "auditsData_v1";

export default function AuditPlanPage() {
  const initialData = audits as any;
  const [plans, setPlans] = useState<any[]>(initialData.plans || []);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    area: "",
    department: "",
    frequency: "",
    standard: "",
    scheduleFrom: "",
    scheduleTo: "",
    status: "Planned",
    remarks: "",
    auditors: "",
  });

  useEffect(() => {
    // load from localStorage if present
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.plans)) setPlans(parsed.plans);
      } catch (e) {
        // ignore parse errors and keep default
      }
    }
  }, []);

  useEffect(() => {
    // persist when plans change
    const payload = { planYear: initialData.planYear, plans };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [plans]);

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

  // CRUD helpers ---------------------------------------------------------
  const openAdd = () => {
    setEditingId(null);
    setForm({
      area: "",
      department: "",
      frequency: "",
      standard: "",
      scheduleFrom: "",
      scheduleTo: "",
      status: "Planned",
      remarks: "",
      auditors: "",
    });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      area: p.area || "",
      department: p.department || "",
      frequency: p.frequency || "",
      standard: p.standard || "",
      scheduleFrom: p.schedule?.from || "",
      scheduleTo: p.schedule?.to || "",
      status: p.status || "Planned",
      remarks: p.remarks || "",
      auditors: (p.auditors || []).map((a: any) => a.name).join(", "),
    });
    setShowModal(true);
  };

  const removePlan = (id: string) => {
    if (!window.confirm("Delete this plan? This cannot be undone.")) return;
    setPlans((prev) => prev.filter((x) => x.id !== id));
  };

  const savePlan = () => {
    // minimal validation
    if (!form.area || !form.scheduleFrom || !form.scheduleTo) {
      alert("Please provide at least Area and Schedule dates.");
      return;
    }

    const auditorsArr = form.auditors
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map((name: string, idx: number) => ({
        userId: `u.${name.replace(/\s+/g, "").toLowerCase() || idx}`,
        name,
        assignment: {
          area: form.area,
          zone: "",
          dateFrom: `${form.scheduleFrom}T09:00:00`,
          dateTo: `${form.scheduleTo}T17:00:00`,
        },
      }));

    if (editingId) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                area: form.area,
                department: form.department,
                frequency: form.frequency,
                standard: form.standard,
                schedule: { from: form.scheduleFrom, to: form.scheduleTo },
                status: form.status,
                remarks: form.remarks,
                auditors: auditorsArr,
              }
            : p
        )
      );
    } else {
      const newId = `${new Date(form.scheduleFrom).getFullYear()}-${String(
        plans.length + 1
      ).padStart(2, "0")}-${(form.standard || "PLAN")
        .replace(/\s+/g, "")
        .toUpperCase()}`;
      const newPlan = {
        id: newId,
        area: form.area,
        department: form.department,
        frequency: form.frequency,
        standard: form.standard,
        auditors: auditorsArr,
        schedule: { from: form.scheduleFrom, to: form.scheduleTo },
        status: form.status,
        remarks: form.remarks,
        checklists: [],
        reports: [],
        cars: [],
      };
      setPlans((prev) => [...prev, newPlan]);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Annual Audit Calendar Planner {initialData.planYear}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Add Plan
          </button>
        </div>
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
            {plans.map((p: any, index: number) => (
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
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removePlan(p.id)}
                      className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded"
                    >
                      Delete
                    </button>
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
                      {p.checklists && p.checklists[0] && (
                        <Link
                          to={`/audit/checklists/${p.checklists[0].id}`}
                          className="text-primary-600 hover:underline text-xs"
                        >
                          Checklist
                        </Link>
                      )}
                      {p.reports && p.reports[0] && (
                        <Link
                          to={`/audit/reports/${p.reports[0].id}`}
                          className="text-primary-600 hover:underline text-xs"
                        >
                          Report
                        </Link>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Add / Edit Plan */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Plan" : "Add Plan"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border p-2"
                placeholder="Area"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />
              <input
                className="border p-2"
                placeholder="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
              <input
                className="border p-2"
                placeholder="Frequency"
                value={form.frequency}
                onChange={(e) =>
                  setForm({ ...form, frequency: e.target.value })
                }
              />
              <input
                className="border p-2"
                placeholder="Standard (ISO/HACCP)"
                value={form.standard}
                onChange={(e) => setForm({ ...form, standard: e.target.value })}
              />
              <input
                type="date"
                className="border p-2"
                value={form.scheduleFrom}
                onChange={(e) =>
                  setForm({ ...form, scheduleFrom: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2"
                value={form.scheduleTo}
                onChange={(e) =>
                  setForm({ ...form, scheduleTo: e.target.value })
                }
              />
              <select
                className="border p-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Planned</option>
                <option>In Progress</option>
                <option>Not Started</option>
                <option>Completed</option>
              </select>
              <input
                className="border p-2"
                placeholder="Remarks"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-600">
                Auditors (comma separated names)
              </label>
              <input
                className="border p-2 w-full mt-1"
                placeholder="John, Mary"
                value={form.auditors}
                onChange={(e) => setForm({ ...form, auditors: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={savePlan}
                className="px-3 py-2 bg-primary-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Audits</div>
          <div className="text-2xl font-bold text-gray-900">{plans.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="text-2xl font-bold text-gray-900">
            {plans.filter((p: any) => p.status === "In Progress").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">Planned</div>
          <div className="text-2xl font-bold text-gray-900">
            {plans.filter((p: any) => p.status === "Planned").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="text-sm font-medium text-gray-500">Not Started</div>
          <div className="text-2xl font-bold text-gray-900">
            {plans.filter((p: any) => p.status === "Not Started").length}
          </div>
        </div>
      </div>
    </div>
  );
}
