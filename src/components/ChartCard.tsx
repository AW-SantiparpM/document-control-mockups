import React from "react";
interface Point { status:string; count:number; }
export default function ChartCard({title,data}:{title:string; data:Point[]}) {
  const max = Math.max(...data.map(d=>d.count),1);
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-xs font-medium mb-2">{title}</div>
      <div className="flex items-end gap-2 h-40">
        {data.map(d=>(
          <div key={d.status} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full bg-primary-600 rounded-t" style={{height:`${(d.count/max)*100}%`}} />
            <div className="text-[10px] text-slate-600 text-center">{d.status}</div>
            <div className="text-[10px]">{d.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}