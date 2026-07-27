import React from 'react';
import { Users, AlertTriangle, CheckCircle2, XCircle, Award } from 'lucide-react';

export default function StatsCards({ stats, currentFilterMismatch, onToggleMismatchFilter }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Runners Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Reviewed Runners</p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.total.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Lineups E, A, and B requested</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Lineup Mismatches Card (Clickable to filter!) */}
      <div 
        onClick={onToggleMismatchFilter}
        className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition ${
          currentFilterMismatch 
            ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10' 
            : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50'
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">AI Lineup Discrepancies</p>
            {currentFilterMismatch && (
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">Active Filter</span>
            )}
          </div>
          <p className="text-2xl font-extrabold text-amber-300 mt-1">{stats.mismatchCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Requested section != AI Expected section</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Default Approved Count */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Organizer Approved</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.approvedCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Default state (unless flagged)</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Disapproved Count */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Disapproved / Flagged</p>
          <p className="text-2xl font-extrabold text-rose-400 mt-1">{stats.disapprovedCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Flagged manually by organizers</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <XCircle className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
