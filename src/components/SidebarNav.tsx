import React from "react";
import { NavLink } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

interface Item {
  label?: string; // legacy
  labelKey?: string; // i18n key
  to: string;
  icon?: string;
}
export default function SidebarNav({
  items,
  onClose,
  collapsed,
  toggleCollapse,
}: {
  items: Item[];
  onClose?: () => void;
  collapsed: boolean;
  toggleCollapse: () => void;
}) {
  const { t } = useLang();
  const { theme, toggle } = useTheme();
  return (
    <aside
      className={clsx(
        "h-full border-r border-slate-200 dark:border-slate-700 flex flex-col backdrop-blur-xl glass transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60",
        "bg-white/80 dark:bg-slate-900/60"
      )}
      aria-label="Primary navigation"
    >
      <div className="h-14 flex items-center px-3 font-semibold text-primary-600 justify-between">
        <span className="truncate text-sm"></span>
        <div className="flex items-center gap-1">
          <button
            className="hidden lg:inline-flex text-[10px] px-2 py-1 rounded bg-primary-600 text-white"
            onClick={toggleCollapse}
            aria-label={
              collapsed ? t("action.expandSidebar") : t("action.toggleSidebar")
            }
          >
            {collapsed ? ">" : "<"}
          </button>
          <button
            className="lg:hidden text-xs text-slate-500"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 space-y-1">
        {items.map((i) => {
          const label = i.labelKey ? t(i.labelKey as any) : i.label || "";
          return (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 px-3 py-2 text-[13px] rounded-md mx-2 font-medium tracking-wide",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )
              }
            >
              <span aria-hidden className="text-base">
                {i.icon}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
              {collapsed && <span className="sr-only">{label}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-2 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={toggle}
          className="w-full text-[10px] px-2 py-1 rounded bg-slate-900/80 text-white dark:bg-slate-100 dark:text-slate-900"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
        <button
          onClick={toggleCollapse}
          className="w-full text-[10px] px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {collapsed ? t("action.expandSidebar") : t("action.toggleSidebar")}
        </button>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
          Prototype
        </div>
      </div>
    </aside>
  );
}
