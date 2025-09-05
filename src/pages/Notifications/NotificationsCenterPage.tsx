import React from "react";
import { useNotifications } from "../../context/NotificationContext";
export default function NotificationsCenterPage(){
  const { notifications, markRead, markAll } = useNotifications();
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Notifications Center</h1>
        <button onClick={markAll} className="text-xs text-primary-600 hover:underline">Mark All Read</button>
      </div>
      <ul className="space-y-2">
        {notifications.map(n=>(
          <li key={n.id} className="bg-white border rounded p-3 flex justify-between items-start text-xs">
            <div>
              <div className="font-medium">{n.message}</div>
              <div className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.read && <button onClick={()=>markRead(n.id)} className="text-primary-600 hover:underline text-[10px]">Read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}