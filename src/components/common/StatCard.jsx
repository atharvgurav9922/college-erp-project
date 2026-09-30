import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  gradient = 'from-indigo-500 to-indigo-600',
  iconBg = 'bg-indigo-50 text-indigo-600'
}) => {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-md transition-all duration-200 group relative overflow-hidden">
      {/* Decorative accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-80 group-hover:opacity-100 transition`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2 font-display">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {trend}
          </span>
          <span className="text-slate-400 font-medium">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
