import React,{useState} from "react";
interface Field { field:string; type:string; label:string; required?:boolean; options?:string[]; }
export default function FormBuilder({schema,onSubmit}:{schema:Field[]; onSubmit:(values:Record<string,any>)=>void}) {
  const [values,setValues] = useState<Record<string,any>>({});
  const update=(f:string,v:any)=>setValues(p=>({...p,[f]:v}));
  return (
    <form className="space-y-4" onSubmit={e=>{e.preventDefault();onSubmit(values);}}>
      {schema.map(f=>(
        <div key={f.field} className="flex flex-col gap-1">
          <label className="text-xs font-medium" htmlFor={f.field}>{f.label}{f.required && <span className="text-danger-600">*</span>}</label>
          {f.type==="select" && (
            <select id={f.field} required={f.required} className="border rounded px-2 py-1 text-sm"
              value={values[f.field]??""} onChange={e=>update(f.field,e.target.value)}>
              <option value="">Select...</option>
              {f.options?.map(o=><option key={o}>{o}</option>)}
            </select>
          )}
          {f.type==="textarea" && (
            <textarea id={f.field} required={f.required} className="border rounded px-2 py-1 text-sm"
              value={values[f.field]??""} onChange={e=>update(f.field,e.target.value)} />
          )}
          {["text","date"].includes(f.type) && (
            <input id={f.field} type={f.type} required={f.required} className="border rounded px-2 py-1 text-sm"
              value={values[f.field]??""} onChange={e=>update(f.field,e.target.value)} />
          )}
        </div>
      ))}
      <button className="px-4 py-2 bg-primary-600 text-white rounded text-sm">Submit</button>
    </form>
  );
}