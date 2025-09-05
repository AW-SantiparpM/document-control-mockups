import React from "react";
export default function ReportsPage(){
  const reports=[
    { id:"RPT-01", name:"Document Status Summary" },
    { id:"RPT-02", name:"Open CAR Aging" },
    { id:"RPT-03", name:"Form Submission Volume" },
    { id:"RPT-04", name:"Audit Plan Completion" },
    { id:"RPT-05", name:"Scanned Docs Index Lag" }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map(r=>(
          <li key={r.id} className="border rounded bg-white p-4 flex flex-col gap-2">
            <div className="font-medium text-sm">{r.name}</div>
            <button className="text-xs text-primary-600 underline decoration-dotted">Generate</button>
          </li>
        ))}
      </ul>
    </div>
  );
}