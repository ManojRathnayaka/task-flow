export default function StatCard({ Icon, value, label, color, bg, id }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md" id={id}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className={`text-2xl font-bold leading-none ${color}`}>{value}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">{label}</div>
      </div>
    </div>
  );
}
