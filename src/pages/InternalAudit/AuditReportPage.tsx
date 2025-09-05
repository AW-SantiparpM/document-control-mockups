import React from "react";
import audits from "../../data/audits.json";
import { useParams } from "react-router-dom";
export default function AuditReportPage(){
  const { id } = useParams();
  const report = (audits as any).plans.flatMap((p:any)=>p.reports).find((r:any)=>r.id===id);
  if(!report) return <div>Report not found</div>;
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">Audit Report {report.id}</h1>
      <textarea className="w-full border rounded p-2 text-sm min-h-[200px]" placeholder="Summary..." defaultValue={report.summary}></textarea>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded bg-white p-4 text-sm">
          <div className="font-medium">CAR Count</div>
          <div className="text-2xl">{report.carCount}</div>
        </div>
        <div className="border rounded bg-white p-4 text-sm">
          <div className="font-medium">PAR Count</div>
          <div className="text-2xl">{report.parCount}</div>
        </div>
      </div>
      <button className="px-4 py-2 bg-primary-600 text-white rounded text-sm">Publish Report</button>
    </div>
  );
}