import React, { useEffect, useMemo, useState } from "react";
import data from "../../data/approvals.json";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";

interface Step {
  name: string;
  approver: string;
  status: string;
  actedAt?: string;
}
interface Approval {
  id: string;
  targetType: string;
  targetId: string;
  title: string;
  requestedBy: string;
  status: string;
  pendingStep?: string | null;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}

export default function ApprovalsListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [dynamic, setDynamic] = useState<Approval[]>([]);
  const { t } = useLang();
  useEffect(() => {
    const ls = localStorage.getItem("approvals.dynamic");
    if (ls) {
      try {
        const arr = JSON.parse(ls) as Approval[];
        setDynamic(arr);
        (window as any)._approvals = arr;
      } catch {}
    }
    const interval = setInterval(() => {
      const d = (window as any)._approvals as Approval[] | undefined;
      if (d) {
        setDynamic(d);
        localStorage.setItem("approvals.dynamic", JSON.stringify(d));
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);
  const source = [
    ...dynamic,
    ...(data as any as Approval[]).filter(
      (a) => !dynamic.find((d) => d.id === a.id)
    ),
  ];
  const list = useMemo(
    () =>
      source.filter(
        (a) =>
          (!q ||
            a.title.toLowerCase().includes(q.toLowerCase()) ||
            a.id.toLowerCase().includes(q.toLowerCase())) &&
          (!status || a.status === status) &&
          (!type || a.targetType === type)
      ),
    [q, status, type, source]
  );

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold">{t("label.approvals")}</h1>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.global")}
            className="border rounded px-2 py-1 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">{t("label.allStatus")}</option>
            <option>{t("status.Pending")}</option>
            <option>{t("status.Approved")}</option>
            <option>{t("status.Rejected")}</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">{t("label.allTypes")}</option>
            <option value="Document">Document</option>
            <option value="ProductRequest">ProductRequest</option>
            <option value="FormSubmission">FormSubmission</option>
          </select>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">{t("label.id")}</th>
              <th className="p-2 text-left">{t("label.type")}</th>
              <th className="p-2 text-left">{t("label.title")}</th>
              <th className="p-2 text-left">{t("label.requester")}</th>
              <th className="p-2 text-left">{t("label.status")}</th>
              <th className="p-2 text-left">{t("label.pendingStep")}</th>
              <th className="p-2 text-left">{t("label.updated")}</th>
              <th className="p-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-t hover:bg-slate-50">
                <td className="p-2">
                  <Link
                    to={`/approvals/${a.id}`}
                    className="text-primary-600 hover:underline"
                  >
                    {a.id}
                  </Link>
                </td>
                <td className="p-2">{a.targetType}</td>
                <td className="p-2">{a.title}</td>
                <td className="p-2">{a.requestedBy}</td>
                <td className="p-2">
                  <span
                    className={`status-badge px-2 py-0.5 rounded border ${
                      a.status === "Approved"
                        ? "status-badge--success"
                        : a.status === "Rejected"
                        ? "status-badge--danger"
                        : a.status === "Pending"
                        ? "status-badge--warning"
                        : ""
                    }`}
                  >
                    {t(`status.${a.status}` as any)}
                  </span>
                </td>
                <td className="p-2 text-xs">{a.pendingStep || "-"}</td>
                <td className="p-2 text-xs">
                  {new Date(a.updatedAt).toLocaleString()}
                </td>
                <td className="p-2 text-right text-xs">
                  <Link
                    to={`/approvals/${a.id}`}
                    className="text-primary-600 hover:underline"
                  >
                    {t("action.open")}
                  </Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-xs text-slate-500"
                >
                  {t("label.approvals")} 0
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
