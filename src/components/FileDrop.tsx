import React,{useCallback,useState} from "react";
export default function FileDrop({onFiles}:{onFiles:(files:File[])=>void}) {
  const [active,setActive]=useState(false);
  const stop=(e:React.DragEvent)=>{e.preventDefault();e.stopPropagation();};
  const handleDrop=useCallback((e:React.DragEvent)=>{stop(e);setActive(false);onFiles(Array.from(e.dataTransfer.files));},[onFiles]);
  return (
    <div
      onDragEnter={e=>{stop(e);setActive(true);}}
      onDragOver={stop}
      onDragLeave={e=>{stop(e);setActive(false);}}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded p-6 text-center text-xs ${active?"border-primary-600 bg-primary-50":"border-slate-300"}`}
      aria-label="File drop zone"
    >
      Drag & drop files or click to browse
      <input type="file" multiple className="hidden" />
    </div>
  );
}