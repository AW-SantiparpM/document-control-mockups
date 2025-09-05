import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import NotificationToast from "./NotificationToast";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";
export default function TopBar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { notifications, unread, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { toggle: toggleLang, lang, t } = useLang();
  return (
    <header
      className="h-14 glass border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 gap-4 shadow-sm"
      role="banner"
    >
      <div className="flex items-center gap-2">
        <button
          className="lg:hidden px-2 py-1 border rounded"
          aria-label="Toggle menu"
          onClick={onToggleSidebar}
        >
          â˜°
        </button>
        <h4>Prototype</h4>
        {/* <input
          placeholder={t("search.global")}
          className="border rounded-md px-3 py-1.5 text-sm w-56 bg-white/70 dark:bg-slate-800/70 backdrop-blur focus-visible:ring-primary-600"
        /> */}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button
          onClick={toggleLang}
          className="text-xs px-2 py-1 rounded bg-primary-600 text-white"
        >
          {lang === "th" ? "EN" : "TH"}
        </button>
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setOpen((o) => !o)}
            className="relative"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-2 -right-2 bg-danger-600 text-white text-[10px] px-1 rounded-full">
                {unread}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-80 card p-2 max-h-96 overflow-y-auto z-20 bg-white/90 dark:bg-slate-900/90">
              <h3 className="text-xs font-semibold mb-1">Notifications</h3>
              <ul className="space-y-1">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="text-xs flex items-start gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{n.message}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[10px] text-primary-600 hover:underline"
                      >
                        Mark
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-600">user@example</div>
      </div>
      <NotificationToast />
    </header>
  );
}
