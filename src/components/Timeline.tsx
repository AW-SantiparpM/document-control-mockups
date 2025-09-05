import React from "react";
export interface TimelineItem { time:string; label:string; actor?:string; meta?:string; }
export default function Timeline({items}:{items:TimelineItem[]}) {
  return (
    <ol className="relative border-l border-slate-300 text-xs">
      {items.map(i=>(
        <li key={i.time+i.label} className="ml-4 mb-4">
          <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-primary-600 border border-white"></div>
            <div className="font-medium">{i.label}</div>
            <div className="text-slate-500">{new Date(i.time).toLocaleString()} {i.actor && `â€¢ ${i.actor}`}</div>
            {i.meta && <div className="text-slate-400">{i.meta}</div>}
        </li>
      ))}
    </ol>
  );
}