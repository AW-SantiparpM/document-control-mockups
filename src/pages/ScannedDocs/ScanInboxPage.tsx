import React,{useState} from "react";
import scans from "../../data/scans.json";
import { Link } from "react-router-dom";
export default function ScanInboxPage(){
  const [status,setStatus]=useState("");
  const list = (scans as any[]).filter(s=>!status || s.status===status);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Scanned Documents</h1>
      <div className="flex gap-2">
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="">All Statuses</option>
          <option>Indexed</option>
          <option>Pending</option>
        </select>
        <button className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm" disabled>Connect Scanner</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">File</th>
              <th className="text-left p-2">PO</th>
              <th className="text-left p-2">Material</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {list.map(s=>(
              <tr key={s.id} className="border-t">
                <td className="p-2"><Link to={`/scans/${s.id}`} className="text-primary-600 hover:underline">{s.fileName}</Link></td>
                <td className="p-2">{s.po}</td>
                <td className="p-2">{s.material}</td>
                <td className="p-2">{s.status}</td>
                <td className="p-2">{new Date(s.uploadedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}