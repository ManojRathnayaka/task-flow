interface StatCardProps {
  Icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
  bg: string;
  id?: string;
}

export default function StatCard({ Icon, value, label, color, bg, id }: StatCardProps) {
  // Extract pure color names to map to dark variants if needed, or rely on transparency
  return (
    <div className={`bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md`} id={id}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bg} dark:bg-opacity-20 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className={`text-2xl font-bold leading-none ${color}`}>{value}</div>
        <div className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-1">{label}</div>
      </div>
    </div>
  );
}
