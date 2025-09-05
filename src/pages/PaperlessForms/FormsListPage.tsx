import React from "react";
import forms from "../../data/forms.json";
import { Link } from "react-router-dom";
export default function FormsListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Forms</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(forms as any[]).map((f) => (
          <div
            key={f.id}
            className="border rounded bg-white p-4 flex flex-col gap-2"
          >
            <div className="font-medium">{f.name}</div>
            <div className="text-xs text-slate-500">v{f.version}</div>
            <Link
              to={`/forms/${f.id}/fill`}
              className="text-xs text-primary-600 hover:underline"
            >
              Fill Form →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
