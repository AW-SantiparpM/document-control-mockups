import React from "react";
import scans from "../../data/scans.json";
import { useParams } from "react-router-dom";
export default function ScanDetailPage(){
  const { id } = useParams();
  const scan = (scans as any[]).find(s=>s.id===id);
  if(!scan) return <div>Not found</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{scan.fileName}</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-80 bg-white border rounded flex items-center justify-center text-xs text-slate-400">
          PDF/Image Preview
        </div>
        <div className="bg-white border rounded p-4 text-xs space-y-1">
          <div><span className="font-semibold">PO:</span> {scan.po}</div>
          <div><span className="font-semibold">Material:</span> {scan.material}</div>
          <div><span className="font-semibold">Status:</span> {scan.status}</div>
          <div><span className="font-semibold">Tags:</span> {scan.tags.join(", ")}</div>
          <button className="mt-2 px-3 py-1 bg-primary-600 text-white rounded text-xs">Download</button>
        </div>
      </div>
    </div>
  );
}