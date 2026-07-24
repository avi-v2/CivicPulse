import StatItem from "./StatItem";
import React from "react";
import { AlertCircle, CheckCircle2, Clock, ListOrdered } from 'lucide-react';

function StatsCard({reports}){
    const total = reports.length;
    const pending = reports.filter(r => r.status === "Pending").length;
    const resolved = reports.filter(r => r.status === "Resolved").length;
    const highPriority = reports.filter(r => r.severity === "High").length;
    return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <StatItem icon={<ListOrdered className="w-4 h-4 text-slate-500" />} label="Total" value={total} />
      <StatItem icon={<Clock className="w-4 h-4 text-orange-500" />} label="Pending" value={pending} />
      <StatItem icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} label="Resolved" value={resolved} />
      <StatItem icon={<AlertCircle className="w-4 h-4 text-red-500" />} label="High Priority" value={highPriority} />
    </div>
  );
}
export default StatsCard