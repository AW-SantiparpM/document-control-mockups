import React,{useState,useMemo} from "react";
import data from "../../data/documents.json";
import { Link } from "react-router-dom";
export default function DocumentListPage(){
  const [filter,setFilter]=useState("");
  const docs=useMemo(()=> (data as any[])
    .filter(d=> d.title.toLowerCase().includes(filter.toLowerCase()) || d.id.toLowerCase().includes(filter.toLowerCase())),[filter]);
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Documents</h1>
        <div className="flex gap-2">
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search ID or Title..."
            className="border rounded px-2 py-1 text-sm" aria-label="Search documents" />
          <Link to="/documents/new-request" className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
            New Request
          </Link>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white border rounded shadow-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Owner</th>
            </tr>
          </thead>
          <tbody>
            {docs.map(d=>(
              <tr key={d.id} className="border-t hover:bg-slate-50">
                <td className="p-2"><Link className="text-primary-600 hover:underline" to={`/documents/${d.id}`}>{d.id}</Link></td>
                <td className="p-2">{d.title}</td>
                <td className="p-2">{d.type}</td>
                <td className="p-2"><span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700">{d.status}</span></td>
                <td className="p-2">{d.owner}</td>
              </tr>
            ))}
            {docs.length===0 && <tr><td colSpan={5} className="p-4 text-center text-xs text-slate-500">No documents</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}