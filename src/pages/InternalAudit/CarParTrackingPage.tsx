import React from "react";
import audits from "../../data/audits.json";
export default function CarParTrackingPage(){
  const cars = (audits as any).plans.flatMap((p:any)=>p.cars);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">CAR / PAR Tracking</h1>
      <div className="overflow-x-auto">
        <table className="text-sm w-full bg-white border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Due</th>
              <th className="text-left p-2">Owner</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c:any)=>(
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.type}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">{c.dueDate}</td>
                <td className="p-2">{c.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}