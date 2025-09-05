import { useEffect, useState } from "react";
export function useLocalData<T>(loader:()=>Promise<T>|T,deps:any[]=[]){
  const [data,setData]=useState<T|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<any>(null);
  useEffect(()=>{ let m=true;(async()=>{ try{ const r=await loader(); if(m){setData(r);setLoading(false);} }catch(e){ if(m){setError(e);setLoading(false);} }})(); return ()=>{m=false};},deps);
  return { data, loading, error };
}