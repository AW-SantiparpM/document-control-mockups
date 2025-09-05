import React,{useState} from "react";
import FileDrop from "../../components/FileDrop";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
export default function NewDocumentRequestPage(){
  const [title,setTitle]=useState("");
  const [type,setType]=useState("Policy");
  const [action,setAction]=useState("New");
  const [reason,setReason]=useState("");
  const [files,setFiles]=useState<File[]>([]);
  const { add } = useNotifications();
  const nav=useNavigate();
  const submit=()=>{
    add({ message:`Document request (${action}) submitted: ${title}`, channel:"web" });
    nav("/documents");
  };
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">New Document Request</h1>
      <div className="space-y-4 bg-white border rounded p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Type</label>
            <select value={type} onChange={e=>setType(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option>Policy</option><option>Procedure</option><option>WorkInstruction</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Action</label>
            <select value={action} onChange={e=>setAction(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option>New</option><option>Update</option><option>Cancel</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Reason / Description</label>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} className="border rounded px-2 py-1 text-sm min-h-[80px]" />
        </div>
        <div>
          <label className="text-xs font-medium">File</label>
          <FileDrop onFiles={setFiles}/>
          {files.length>0 && <div className="text-[10px] mt-1 text-slate-500">{files.length} file(s) selected</div>}
        </div>
        <button disabled={!title} onClick={submit} className="px-4 py-2 bg-primary-600 disabled:opacity-50 text-white rounded text-sm">
          Submit Request
        </button>
      </div>
    </div>
  );
}