import React, { useEffect, useMemo, useState } from "react";
import data from "../../data/approvals.json";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { useLang } from "../../context/LangContext";

interface Step {
  name: string;
  approver: string;
  status: string;
  actedAt?: string;
  comment?: string;
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

export default function ApprovalDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useNotifications();
  const { t } = useLang();
  const [dynamic, setDynamic] = useState<Approval[]>(
    () => (window as any)._approvals || []
  );
  useEffect(() => {
    const d = (window as any)._approvals as Approval[] | undefined;
    if (d) setDynamic(d);
  }, []);
  const source = [
    ...dynamic,
    ...(data as any as Approval[]).filter(
      (a) => !dynamic.find((d) => d.id === a.id)
    ),
  ];
  const approval = useMemo(() => source.find((a) => a.id === id), [id, source]);
  const [comment, setComment] = useState("");

  if (!approval) {
    return (
      <div className="space-y-4">
        <button onClick={() => nav(-1)} className="text-sm text-primary-600">
          &larr; {t("action.back")}
        </button>
        <div className="text-sm text-danger-600">Approval not found</div>
      </div>
    );
  }

  const currentIndex = approval.steps.findIndex((s) => s.status === "Pending");
  const current = currentIndex >= 0 ? approval.steps[currentIndex] : null;

  function act(result: "Approved" | "Rejected") {
    if (!current || !approval) {
      return;
    }
    const now = new Date().toISOString();
    const updated: Approval = {
      ...approval,
      steps: approval.steps.map((s, i) =>
        i === currentIndex
          ? {
              ...s,
              status: result,
              actedAt: now,
              comment: comment || undefined,
            }
          : s
      ),
      updatedAt: now,
    } as Approval;
    // determine next state
    const nextPending = updated.steps.find((s) => s.status === "Waiting");
    if (result === "Rejected") {
      updated.status = "Rejected";
      updated.pendingStep = null;
      // mark remaining waiting as Skipped
      updated.steps = updated.steps.map((s) =>
        s.status === "Waiting" ? { ...s, status: "Skipped" } : s
      );
    } else if (nextPending) {
      updated.status = "Pending";
      updated.steps = updated.steps.map((s) =>
        s === nextPending ? { ...s, status: "Pending" } : s
      );
      updated.pendingStep = nextPending.name;
    } else {
      updated.status = "Approved";
      updated.pendingStep = null;
    }
    // persist in window
    const existing = ((window as any)._approvals as Approval[]) || [];
    (window as any)._approvals = [
      updated,
      ...existing.filter((a) => a.id !== updated.id),
    ];
    add({ message: `${result} ${updated.id}`, channel: "web" });
    try {
      localStorage.setItem(
        "approvals.dynamic",
        JSON.stringify((window as any)._approvals)
      );
    } catch {}
    nav("/approvals/" + updated.id);
  }

  return (
    <div className="space-y-6">
      <button onClick={() => nav(-1)} className="text-sm text-primary-600">
        &larr; {t("action.back")}
      </button>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{approval.title}</h1>
          <div className="text-xs text-slate-500 space-x-2">
            <span>ID {approval.id}</span>
            <span>Type {approval.targetType}</span>
            <span className="inline-flex items-center gap-1">
              {t("label.status")}{" "}
              <strong
                className={
                  approval.status === "Approved"
                    ? "text-success-600"
                    : approval.status === "Rejected"
                    ? "text-danger-600"
                    : "text-primary-700"
                }
              >
                {t(`status.${approval.status}` as any)}
              </strong>
            </span>
          </div>
        </div>
        {current && approval.status === "Pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => act("Rejected")}
              className="px-3 py-1.5 bg-danger-600 text-white rounded text-sm"
            >
              {t("action.reject")}
            </button>
            <button
              onClick={() => act("Approved")}
              className="px-3 py-1.5 bg-success-600 text-white rounded text-sm"
            >
              {t("action.approve")}
            </button>
          </div>
        )}
      </header>
      <section className="bg-white border rounded p-4 space-y-4">
        <h2 className="font-medium text-sm">{t("label.steps")}</h2>
        <ol className="space-y-2 text-sm">
          {approval.steps.map((s, i) => (
            <li
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border rounded px-3 py-2 bg-slate-50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{s.name}</span>
                <span className="text-[10px] text-slate-500">
                  Approver: {s.approver}
                </span>
              </div>
              <div className="text-xs flex flex-col items-end">
                <span
                  className={`status-badge px-2 py-0.5 rounded border ${
                    s.status === "Approved"
                      ? "status-badge--success"
                      : s.status === "Rejected"
                      ? "status-badge--danger"
                      : s.status === "Pending"
                      ? "status-badge--warning"
                      : ""
                  }`}
                >
                  {t(`status.${s.status}` as any)}
                </span>
                {s.actedAt && (
                  <span className="text-[10px] text-slate-500">
                    {new Date(s.actedAt).toLocaleString()}
                  </span>
                )}
                {s.comment && (
                  <span className="text-[10px] italic text-slate-500">
                    "{s.comment}"
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
      {current && approval.status === "Pending" && (
        <section className="bg-white border rounded p-4 space-y-3">
          <h2 className="font-medium text-sm">
            {t("label.yourAction")}: {current.name}
          </h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("label.commentOptional")}
            className="w-full border rounded p-2 text-sm min-h-[100px]"
          />
          <div className="flex gap-2">
            <button
              onClick={() => act("Rejected")}
              className="px-3 py-1.5 bg-danger-600 text-white rounded text-sm"
            >
              {t("action.reject")}
            </button>
            <button
              onClick={() => act("Approved")}
              className="px-3 py-1.5 bg-success-600 text-white rounded text-sm"
            >
              {t("action.approve")}
            </button>
          </div>
        </section>
      )}
      <section className="text-[10px] text-slate-500">
        Created {new Date(approval.createdAt).toLocaleString()} | Updated{" "}
        {new Date(approval.updatedAt).toLocaleString()}
      </section>
    </div>
  );
}
