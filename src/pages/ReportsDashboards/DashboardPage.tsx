import React from "react";
import reports from "../../data/reports.json";
import StatCard from "../../components/StatCard";
import ChartCard from "../../components/ChartCard";
export default function DashboardPage(){
  const kpis=(reports as any).kpis;
  const charts=(reports as any).charts;
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k:any)=><StatCard key={k.key} label={k.label} value={k.value} delta={k.delta} />)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Documents by Status" data={charts.docByStatus} />
        <ChartCard title="CARs by Status" data={charts.carsByStatus} />
      </div>
    </div>
  );
}