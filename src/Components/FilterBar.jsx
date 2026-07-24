
import React from 'react';

const CATEGORIES = ['All', 'Pothole', 'Garbage', 'Water Leakage', 'Street Light', 'Sewage', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved'];
const SEVERITIES = ['All', 'Low', 'Medium', 'High'];

function FilterBar ({filters,setFilters}){
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  return(
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <h2 className="font-semibold text-slate-800">Filters</h2>
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category</label>
        <select 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
        <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</label>
        <select 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
        >
          {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

    </div>
  )
}
export default FilterBar