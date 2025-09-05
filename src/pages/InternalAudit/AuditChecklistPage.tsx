import React, { useEffect, useState } from "react";
import audits from "../../data/audits.json";
import { useParams, Link, useNavigate } from "react-router-dom";

const STORAGE_KEY = "auditsData_v1";

export default function AuditChecklistPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage if available, fallback to audits.json
    const raw = localStorage.getItem(STORAGE_KEY);
    let data: any = audits;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        // fallback to file data
      }
    }

    const found = (data.plans || [])
      .flatMap((p: any) => p.checklists || [])
      .find((c: any) => c.id === id);
    if (found) {
      // deep clone to allow editing locally
      setChecklist(JSON.parse(JSON.stringify(found)));
    } else {
      setChecklist(null);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!checklist)
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Back
          </button>
          <Link
            to="/audit/plan"
            className="text-sm text-primary-600 hover:underline"
          >
            Back to Audit Plan
          </Link>
        </div>
        <div>Checklist not found</div>
      </div>
    );

  const updateItemText = (idx: number, text: string) => {
    setChecklist((prev: any) => {
      const copy = { ...prev, items: [...prev.items] };
      copy.items[idx] = { ...copy.items[idx], text };
      return copy;
    });
  };

  const updateItemRating = (idx: number, rating: string) => {
    setChecklist((prev: any) => {
      const copy = { ...prev, items: [...prev.items] };
      copy.items[idx] = { ...copy.items[idx], rating: rating || null };
      return copy;
    });
  };

  const addItem = () => {
    const newItem = {
      id: `Q${Date.now()}`,
      text: "New question",
      rating: null,
      evidence: [],
    };
    setChecklist((prev: any) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (idx: number) => {
    if (!window.confirm("Remove this question?")) return;
    setChecklist((prev: any) => {
      const copy = { ...prev, items: [...prev.items] };
      copy.items.splice(idx, 1);
      return copy;
    });
  };

  const saveChecklist = () => {
    // Load stored data, find checklist and replace, then save
    const raw = localStorage.getItem(STORAGE_KEY);
    let data: any = audits;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        data = audits;
      }
    }

    let replaced = false;
    data.plans = (data.plans || []).map((p: any) => {
      if (!p.checklists) return p;
      const newChecklists = p.checklists.map((c: any) => {
        if (c.id === checklist.id) {
          replaced = true;
          return checklist;
        }
        return c;
      });
      return { ...p, checklists: newChecklists };
    });

    if (!replaced) {
      // if not found, append to first plan as fallback
      if (data.plans && data.plans[0]) {
        data.plans[0].checklists = data.plans[0].checklists || [];
        data.plans[0].checklists.push(checklist);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert("Checklist saved to localStorage");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Back
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm"
          >
            Add Item
          </button>
          <button
            onClick={saveChecklist}
            className="px-3 py-1 bg-primary-600 text-white rounded text-sm"
          >
            Save Checklist
          </button>
        </div>
      </div>

      <h1 className="text-xl font-semibold">Checklist: {checklist.title}</h1>

      <table className="w-full text-sm bg-white border rounded">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-2 w-12">#</th>
            <th className="text-left p-2">Question</th>
            <th className="text-left p-2 w-40">Rating</th>
            <th className="text-left p-2 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {checklist.items.map((it: any, idx: number) => (
            <tr key={it.id} className="border-t">
              <td className="p-2 align-top">{idx + 1}</td>
              <td className="p-2">
                <input
                  value={it.text}
                  onChange={(e) => updateItemText(idx, e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </td>
              <td className="p-2">
                <select
                  value={it.rating || ""}
                  onChange={(e) => updateItemRating(idx, e.target.value)}
                  className="border rounded px-2 py-1 text-xs w-full"
                >
                  <option value="">--</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>N/A</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => removeItem(idx)}
                  className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
