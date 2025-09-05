import React from "react";
import audits from "../../data/audits.json";
import { useParams } from "react-router-dom";
export default function AuditChecklistPage(){
  const { id } = useParams();
  const check = (audits as any).plans.flatMap((p:any)=>p.checklists).find((c:any)=>c.id===id);
  if(!check) return <div>Checklist not found</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Checklist: {check.title}</h1>
      <table className="w-full text-sm bg-white border rounded">
        <thead className="bg-slate-100">
          <tr><th className="text-left p-2 w-12">#</th><th className="text-left p-2">Question</th><th className="text-left p-2 w-32">Rating</th></tr>
        </thead>
        <tbody>
          {check.items.map((it:any,idx:number)=>(
            <tr key={it.id} className="border-t">
              <td className="p-2">{idx+1}</td>
              <td className="p-2">{it.text}</td>
              <td className="p-2">
                <select className="border rounded px-2 py-1 text-xs">
                  <option></option><option>Yes</option><option>No</option><option>N/A</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="px-4 py-2 bg-primary-600 text-white rounded text-sm">Save Ratings</button>
    </div>
  );
}