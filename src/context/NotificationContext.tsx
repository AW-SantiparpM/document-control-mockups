import React,{createContext,useContext,useState,useCallback} from "react";
import initial from "../data/notifications.json";
export interface Notification { id:string; channel:string; message:string; createdAt:string; read:boolean; }
interface Ctx { notifications:Notification[]; unread:number; add:(n:Omit<Notification,"id"|"createdAt"|"read"> & {id?:string})=>void; markRead:(id:string)=>void; markAll:()=>void; }
const C = createContext<Ctx|null>(null);
export function NotificationProvider({children}:{children:React.ReactNode}) {
  const [notifications,setNotifications] = useState<Notification[]>(initial as any);
  const add = useCallback((n:any)=> {
    setNotifications(p => [{ id:n.id ?? crypto.randomUUID(), message:n.message, channel:n.channel ?? "web", createdAt:new Date().toISOString(), read:false }, ...p]);
  },[]);
  const markRead = useCallback((id:string)=> setNotifications(p=>p.map(x=>x.id===id?{...x,read:true}:x)),[]);
  const markAll = useCallback(()=> setNotifications(p=>p.map(x=>({...x,read:true}))),[]);
  const unread = notifications.filter(n=>!n.read).length;
  return <C.Provider value={{notifications, unread, add, markRead, markAll}}>{children}</C.Provider>;
}
export function useNotifications(){ const ctx=useContext(C); if(!ctx) throw new Error("useNotifications outside provider"); return ctx; }