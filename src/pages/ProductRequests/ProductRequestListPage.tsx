import React, { useEffect, useMemo, useState } from "react";
import { useLang } from "../../context/LangContext";
import data from "../../data/productRequests.json";
import { Link, useNavigate } from "react-router-dom";

interface PR {
  id: string;
  status: string;
  productName: string;
  category: string;
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductRequestListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [dynamic, setDynamic] = useState<PR[]>([]);
  const { t } = useLang();
  useEffect(() => {
    // hydrate from localStorage once
    const ls = localStorage.getItem("productRequests.dynamic");
    if (ls) {
      try {
        const arr = JSON.parse(ls) as PR[];
        setDynamic(arr);
        (window as any)._productRequests = arr; // keep legacy window sync
      } catch {}
    }
    const interval = setInterval(() => {
      const d = (window as any)._productRequests as PR[] | undefined;
      if (d) {
        setDynamic(d);
        localStorage.setItem("productRequests.dynamic", JSON.stringify(d));
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);
  const source = [
    ...dynamic,
    ...(data as any as PR[]).filter((p) => !dynamic.find((d) => d.id === p.id)),
  ];
  const list = useMemo(
    () =>
      source.filter(
        (p) =>
          (!q ||
            p.productName.toLowerCase().includes(q.toLowerCase()) ||
            p.id.toLowerCase().includes(q.toLowerCase())) &&
          (!status || p.status === status)
      ),
    [q, status, source]
  );
  function remove(id: string) {
    if (confirm(`Delete ${id}?`)) {
      (window as any)._productRequests = source.filter((p) => p.id !== id);
      setDynamic((window as any)._productRequests);
      localStorage.setItem(
        "productRequests.dynamic",
        JSON.stringify((window as any)._productRequests)
      );
    }
  }
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold">{t("label.productRequests")}</h1>
        <div className="flex gap-2">
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
            <option>{t("status.Draft")}</option>
            <option>{t("status.Submitted")}</option>
            <option>{t("status.Approved")}</option>
            <option>{t("status.Rejected")}</option>
          </select>
          <button
            onClick={() => navigate("/products/new")}
            className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm"
          >
            {t("action.new")}
          </button>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">{t("label.id")}</th>
              <th className="p-2 text-left">{t("form.productName")}</th>
              <th className="p-2 text-left">{t("label.category")}</th>
              <th className="p-2 text-left">{t("label.status")}</th>
              <th className="p-2 text-left">{t("label.requester")}</th>
              <th className="p-2 text-left">{t("label.updated")}</th>
              <th className="p-2 text-left w-12"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((pr) => (
              <tr key={pr.id} className="border-t hover:bg-slate-50">
                <td className="p-2">
                  <Link
                    to={`/products/${pr.id}`}
                    className="text-primary-600 hover:underline"
                  >
                    {pr.id}
                  </Link>
                </td>
                <td className="p-2">{pr.productName}</td>
                <td className="p-2">{pr.category}</td>
                <td className="p-2">
                  <span
                    className={`status-badge px-2 py-0.5 rounded border ${
                      pr.status === "Approved"
                        ? "status-badge--success"
                        : pr.status === "Rejected"
                        ? "status-badge--danger"
                        : pr.status === "Draft"
                        ? "status-badge--warning"
                        : ""
                    }`}
                  >
                    {t(`status.${pr.status}` as any)}
                  </span>
                </td>
                <td className="p-2">{pr.requestedBy}</td>
                <td className="p-2">
                  {new Date(pr.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => remove(pr.id)}
                    className="text-danger-600 hover:underline text-xs"
                  >
                    {t("action.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-4 text-xs text-slate-500"
                >
                  {t("label.productRequests")} 0
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
