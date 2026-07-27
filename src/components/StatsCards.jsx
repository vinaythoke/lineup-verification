import React from 'react';
import { Users, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function StatsCards({ stats, currentFilterMismatch, onToggleMismatchFilter }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Reviewed Runners Card */}
      <div className="glass-panel rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Total Reviewed Runners</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">{stats.total.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Lineups E, A, and B requested</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Lineup Discrepancies Card (Interactive Filter) */}
      <div 
        onClick={onToggleMismatchFilter}
        className={`glass-panel rounded-2xl p-4.5 flex items-center justify-between cursor-pointer transition duration-150 shadow-sm ${
          currentFilterMismatch 
            ? 'ring-2 ring-amber-500/80 bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50' 
            : 'hover:border-amber-500/40'
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">AI Discrepancies</p>
            {currentFilterMismatch && (
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">Active</span>
            )}
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-300 mt-1 tracking-tight">{stats.mismatchCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Requested != AI Result</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Organizer Approved Count */}
      <div className="glass-panel rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Organizer Approved</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">{stats.approvedCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Default state (unless flagged)</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Disapproved Count */}
      <div className="glass-panel rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Disapproved / Flagged</p>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 tracking-tight">{stats.disapprovedCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Manually reassigned</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}
