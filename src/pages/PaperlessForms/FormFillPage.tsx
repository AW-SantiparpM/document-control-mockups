import React from "react";
import { useParams } from "react-router-dom";
import forms from "../../data/forms.json";
import FormBuilder from "../../components/FormBuilder";
import { useNotifications } from "../../context/NotificationContext";
export default function FormFillPage(){
  const { id } = useParams();
  const form = (forms as any[]).find(f=>f.id===id);
  const { add } = useNotifications();
  if(!form) return <div>Form not found</div>;
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">{form.name}</h1>
      <FormBuilder schema={form.schema} onSubmit={(values)=>{
        add({ message:`Form ${form.id} submitted`, channel:"web" });
        console.log("Submitted", values);
      }} />
    </div>
  );
}