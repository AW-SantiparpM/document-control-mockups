import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";
import { useLang } from "../context/LangContext";
const navItems = [
  { labelKey: "nav.documents", to: "/documents", icon: "📄" },
  { labelKey: "nav.audit", to: "/audit/plan", icon: "🕵️" },
  { labelKey: "nav.forms", to: "/forms", icon: "📝" },
  { labelKey: "nav.scans", to: "/scans", icon: "🖨️" },
  { labelKey: "nav.products", to: "/products", icon: "🧪" },
  { labelKey: "nav.approvals", to: "/approvals", icon: "✅" },
  { labelKey: "nav.dashboard", to: "/dashboard", icon: "📊" },
  { labelKey: "nav.reports", to: "/reports", icon: "📑" },
  { labelKey: "nav.notifications", to: "/notifications", icon: "🔔" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "1"
  );
  const { t, toggle: toggleLang, lang } = useLang();
  const toggleCollapse = () =>
    setCollapsed((c) => {
      const n = !c;
      localStorage.setItem("sidebarCollapsed", n ? "1" : "0");
      return n;
    });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-main)]">
      {open && (
        <SidebarNav
          // map translation inside SidebarNav now using labelKey
          items={navItems as any}
          onClose={() => setOpen(false)}
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
        />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onToggleSidebar={() => setOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" role="main">
          <div className="mb-4 flex gap-2 items-center text-[10px]">
            <button
              onClick={toggleLang}
              className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700"
            >
              {lang === "th" ? "TH" : "EN"}
            </button>
            <span className="opacity-60">•</span>
            <span>{t("label.user")}: user@example</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
