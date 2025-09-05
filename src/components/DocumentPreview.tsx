import React from "react";
import WatermarkOverlay from "./WatermarkOverlay";
export default function DocumentPreview({watermarkText}:{watermarkText?:string}) {
  return (
    <div className="relative border rounded bg-white h-80 flex items-center justify-center text-slate-400">
      <span className="z-10">PDF Preview Placeholder</span>
      {watermarkText && <WatermarkOverlay text={watermarkText} />}
    </div>
  );
}