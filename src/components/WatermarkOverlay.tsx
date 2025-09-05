import React from "react";
export default function WatermarkOverlay({text,angle=-30,opacity=0.15}:{text:string; angle?:number; opacity?:number;}) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden select-none">
      <div style={{transform:`rotate(${angle}deg)`,opacity}} className="text-5xl font-bold tracking-wide text-primary-600 whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}