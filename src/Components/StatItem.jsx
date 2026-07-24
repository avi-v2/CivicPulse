function StatItem(props) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {props.icon}
        {props.label}
      </div>
      <div className="text-xl font-semibold text-slate-800">
        {props.value}
      </div>
    </div>
  );
}
export default StatItem