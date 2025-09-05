import React, { useEffect, useMemo, useState } from "react";
import { useLang } from "../../context/LangContext";
import data from "../../data/productRequests.json";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

interface SpecPrinting {
  method: string[];
  position?: string;
  coating?: string;
}
interface ProductRequestDraft {
  id: string;
  status: string;
  productName: string;
  category: string;
  customer?: string;
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
  spec: {
    ttmCode?: string;
    type?: string;
    layer?: number;
    diameterMm?: number;
    wallThickness?: string;
    tubeColor?: string;
    capType?: string;
    capColor?: string;
    printing?: SpecPrinting;
    endSealing?: string;
    shoulder?: string;
    materials?: { tube?: string; cap?: string };
  };
  tests?: {
    leakTest?: boolean;
    torqueOpen?: number | null;
    torqueCap?: number | null;
  };
  packing?: { std?: boolean; innerPacking?: string; outerPacking?: string };
  notes?: string;
}

const empty: ProductRequestDraft = {
  id: "",
  status: "Draft",
  productName: "",
  category: "New Product",
  requestedBy: "u.current",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  spec: {},
  tests: {},
  packing: {},
  notes: "",
};

export default function ProductRequestEditPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useNotifications();
  const source = data as any as ProductRequestDraft[];
  const original = useMemo(() => source.find((p) => p.id === id), [id, source]);
  const [draft, setDraft] = useState<ProductRequestDraft>(
    mode === "edit" && original ? JSON.parse(JSON.stringify(original)) : empty
  );
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useLang();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (mode === "edit" && original) {
      setDraft(JSON.parse(JSON.stringify(original)));
    }
  }, [mode, original]);

  function update<K extends keyof ProductRequestDraft>(
    key: K,
    value: ProductRequestDraft[K]
  ) {
    setDraft((d) => ({
      ...d,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  }
  function updateSpec<K extends keyof ProductRequestDraft["spec"]>(
    key: K,
    value: any
  ) {
    setDraft((d) => ({
      ...d,
      spec: { ...d.spec, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  }

  function save() {
    if (!draft.productName) {
      setTouched((x) => ({ ...x, productName: true }));
      return;
    }
    if (mode === "create") {
      draft.id = `PR-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;
      add({ message: `Created product request ${draft.id}`, channel: "web" });
    } else {
      add({ message: `Updated product request ${draft.id}`, channel: "web" });
    }
    // client-only persistence: attach to window variable for demo
    (window as any)._productRequests = [
      draft,
      ...((window as any)._productRequests ||
        source.filter((p) => p.id !== draft.id)),
    ];
    try {
      localStorage.setItem(
        "productRequests.dynamic",
        JSON.stringify((window as any)._productRequests)
      );
    } catch {}
    nav(`/products`);
  }
  function del() {
    if (mode === "edit" && draft.id) {
      add({ message: `Deleted product request ${draft.id}`, channel: "web" });
      (window as any)._productRequests = (source || []).filter(
        (p) => p.id !== draft.id
      );
      nav("/products");
    }
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "tube", label: "Tube Spec" },
    { id: "printing", label: "Cap Spec" },
    { id: "tests", label: "Testing" },
    { id: "packing", label: "Packing" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? t("action.new") : "Edit"}{" "}
          {t("label.productRequests")}{" "}
          {draft.id && (
            <span className="text-xs font-normal text-slate-500">
              {draft.id}
            </span>
          )}
        </h1>
        <div className="flex gap-2">
          {mode === "edit" && (
            <button
              onClick={del}
              className="px-3 py-1.5 bg-danger-600 text-white rounded text-sm"
            >
              {t("action.delete")}
            </button>
          )}
          <button
            onClick={save}
            className="px-4 py-1.5 bg-primary-600 text-white rounded text-sm"
          >
            {t("action.save")}
          </button>
        </div>
      </header>
      <div className="border-b flex gap-2 overflow-x-auto text-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 -mb-px border-b-2 ${
              activeTab === t.id
                ? "border-primary-600 text-primary-700 font-medium"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {activeTab === "general" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">General Information</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs flex items-center gap-1">
                {t("form.productName")}
                <span className="text-danger-600">*</span>
              </label>
              <input
                value={draft.productName}
                onChange={(e) => update("productName", e.target.value)}
                onBlur={() => setTouched((x) => ({ ...x, productName: true }))}
                className={`border rounded px-2 py-1 text-sm ${
                  touched.productName && !draft.productName
                    ? "border-danger-500 bg-danger-50"
                    : ""
                }`}
              />
              {touched.productName && !draft.productName && (
                <div className="text-[10px] text-danger-600">
                  {t("validation.required")}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs">{t("form.category")}</label>
                <select
                  value={draft.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option>New Product</option>
                  <option>Reference to be existing product</option>
                  <option>Lock BOM Product Code</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">{t("form.customer")}</label>
                <input
                  value={draft.customer || ""}
                  onChange={(e) => update("customer" as any, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">{t("form.requestedBy")}</label>
              <input
                value={draft.requestedBy}
                onChange={(e) => update("requestedBy", e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">Status & Dates</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Status</label>
              <select
                value={draft.status}
                onChange={(e) => update("status", e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option>Draft</option>
                <option>Submitted</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="text-[10px] text-slate-500">
              Created: {new Date(draft.createdAt).toLocaleString()}
              <br />
              Updated: {new Date(draft.updatedAt).toLocaleString()}
            </div>
          </div>
        </section>
      )}
      {activeTab === "tube" && (
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 bg-white border rounded p-4 col-span-2">
            <h2 className="font-medium text-sm">Tube Specification</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs">TTM Code</label>
                <input
                  value={draft.spec.ttmCode || ""}
                  onChange={(e) => updateSpec("ttmCode", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Type</label>
                <input
                  value={draft.spec.type || ""}
                  onChange={(e) => updateSpec("type", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Layer</label>
                <input
                  value={draft.spec.layer || ""}
                  onChange={(e) =>
                    updateSpec("layer", Number(e.target.value) || undefined)
                  }
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Diameter (mm)</label>
                <input
                  value={draft.spec.diameterMm || ""}
                  onChange={(e) =>
                    updateSpec(
                      "diameterMm",
                      Number(e.target.value) || undefined
                    )
                  }
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Wall Thickness</label>
                <input
                  value={draft.spec.wallThickness || ""}
                  onChange={(e) => updateSpec("wallThickness", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Tube Color</label>
                <input
                  value={draft.spec.tubeColor || ""}
                  onChange={(e) => updateSpec("tubeColor", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Cap Type</label>
                <input
                  value={draft.spec.capType || ""}
                  onChange={(e) => updateSpec("capType", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs">Cap Color</label>
                <input
                  value={draft.spec.capColor || ""}
                  onChange={(e) => updateSpec("capColor", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">Materials</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Tube Material</label>
              <input
                value={draft.spec.materials?.tube || ""}
                onChange={(e) =>
                  updateSpec("materials", {
                    ...(draft.spec.materials || {}),
                    tube: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Cap Material</label>
              <input
                value={draft.spec.materials?.cap || ""}
                onChange={(e) =>
                  updateSpec("materials", {
                    ...(draft.spec.materials || {}),
                    cap: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">End Sealing</label>
              <input
                value={draft.spec.endSealing || ""}
                onChange={(e) => updateSpec("endSealing", e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Shoulder</label>
              <input
                value={draft.spec.shoulder || ""}
                onChange={(e) => updateSpec("shoulder", e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </section>
      )}
      {activeTab === "printing" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">CAP</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs">RM</label>
              <input
                value={(draft.spec.printing?.method || []).join(",")}
                onChange={(e) =>
                  updateSpec("printing", {
                    ...(draft.spec.printing || {}),
                    method: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Mold Code</label>
              <input
                value={draft.spec.printing?.position || ""}
                onChange={(e) =>
                  updateSpec("printing", {
                    ...(draft.spec.printing || {}),
                    position: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Color</label>
              <input
                value={draft.spec.printing?.coating || ""}
                onChange={(e) =>
                  updateSpec("printing", {
                    ...(draft.spec.printing || {}),
                    coating: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">Sticker</h2>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={
                  !!draft.spec.printing?.method &&
                  draft.spec.printing?.method.includes("Sticker")
                }
                onChange={(e) => {
                  const has = e.target.checked;
                  const m = new Set(draft.spec.printing?.method || []);
                  if (has) m.add("Sticker");
                  else m.delete("Sticker");
                  updateSpec("printing", {
                    ...(draft.spec.printing || {}),
                    method: [...m],
                  });
                }}
              />{" "}
              <span>Include Sticker</span>
            </div>
            <div className="text-[10px] text-slate-500">For demo only</div>
          </div>
        </section>
      )}
      {activeTab === "tests" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">Testing</h2>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={!!draft.tests?.leakTest}
                onChange={(e) =>
                  update("tests", {
                    ...(draft.tests || {}),
                    leakTest: e.target.checked,
                  })
                }
              />{" "}
              <span>Leak Test</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Torque Open (kgf)</label>
              <input
                value={draft.tests?.torqueOpen ?? ""}
                onChange={(e) =>
                  update("tests", {
                    ...(draft.tests || {}),
                    torqueOpen: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Torque Cap (kgf)</label>
              <input
                value={draft.tests?.torqueCap ?? ""}
                onChange={(e) =>
                  update("tests", {
                    ...(draft.tests || {}),
                    torqueCap: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </section>
      )}
      {activeTab === "packing" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 bg-white border rounded p-4">
            <h2 className="font-medium text-sm">Packing</h2>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={!!draft.packing?.std}
                onChange={(e) =>
                  update("packing", {
                    ...(draft.packing || {}),
                    std: e.target.checked,
                  })
                }
              />{" "}
              <span>STD Packing</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Inner Packing</label>
              <input
                value={draft.packing?.innerPacking || ""}
                onChange={(e) =>
                  update("packing", {
                    ...(draft.packing || {}),
                    innerPacking: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Outer Packing</label>
              <input
                value={draft.packing?.outerPacking || ""}
                onChange={(e) =>
                  update("packing", {
                    ...(draft.packing || {}),
                    outerPacking: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </section>
      )}
      {activeTab === "notes" && (
        <section className="space-y-3 bg-white border rounded p-4">
          <h2 className="font-medium text-sm">Notes</h2>
          <textarea
            value={draft.notes || ""}
            onChange={(e) => update("notes", e.target.value)}
            className="border rounded w-full min-h-[160px] p-2 text-sm"
          />
        </section>
      )}
    </div>
  );
}
