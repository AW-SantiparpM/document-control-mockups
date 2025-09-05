import React from "react";
export default function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: number;
  delta: number;
}) {
  const pos = delta >= 0;
  return (
    <div className="bg-white border rounded p-4 flex flex-col gap-1">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div
        className={`text-[11px] font-medium ${
          pos ? "text-success-600" : "text-danger-600"
        }`}
      >
        {pos ? "▲" : "▼"} {Math.abs(delta)}
      </div>
    </div>
  );
}
