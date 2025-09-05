import React,{useEffect,useState} from "react";
import { useNotifications } from "../context/NotificationContext";
export default function NotificationToast(){
  const { notifications } = useNotifications();
  const [latest,setLatest]=useState<string|null>(null);
  useEffect(()=>{
    if(!notifications.length) return;
    const newest=notifications[0];
    if(!newest.read){
      setLatest(newest.id);
      const t=setTimeout(()=>setLatest(null),4000);
      return ()=>clearTimeout(t);
    }
  },[notifications]);
  if(!latest) return null;
  const n=notifications.find(x=>x.id===latest); if(!n) return null;
  return <div role="status" className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded shadow-lg text-xs max-w-xs">
    {n.message}
  </div>;
}