import { Users, AlertTriangle, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

export default function StatsCards({ 
  stats, 
  currentFilterMismatch, 
  onToggleMismatchFilter,
  currentFilterRemarks,
  onToggleRemarksFilter
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
      
      {/* Total Runners Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reviewed</p>
          <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 sm:mt-1">{stats.total.toLocaleString()}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Lineups E, A, and B</p>
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Lineup Mismatches Card (Clickable to filter!) */}
      <div 
        onClick={onToggleMismatchFilter}
        className={`border rounded-xl p-3 sm:p-4 flex items-center justify-between cursor-pointer transition ${
          currentFilterMismatch 
            ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10' 
            : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50'
        }`}
      >
        <div>
          <div className="flex items-center gap-1">
            <p className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider">Discrepancies</p>
            {currentFilterMismatch && (
              <span className="text-[9px] sm:text-[10px] bg-amber-400 text-slate-950 font-bold px-1 py-0.5 rounded">Active</span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-0.5 sm:mt-1">{stats.mismatchCount.toLocaleString()}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Lineup diff or has remarks</p>
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Remarks Card (Clickable to filter!) */}
      <div 
        onClick={onToggleRemarksFilter}
        className={`border rounded-xl p-3 sm:p-4 flex items-center justify-between cursor-pointer transition ${
          currentFilterRemarks === 'WITH_REMARKS'
            ? 'bg-purple-500/20 border-purple-500 shadow-md shadow-purple-500/10' 
            : 'bg-slate-900/70 border-slate-800 hover:border-purple-500/50'
        }`}
      >
        <div>
          <div className="flex items-center gap-1">
            <p className="text-[10px] sm:text-xs font-semibold text-purple-300 uppercase tracking-wider">Remarks</p>
            {currentFilterRemarks === 'WITH_REMARKS' && (
              <span className="text-[9px] sm:text-[10px] bg-purple-400 text-slate-950 font-bold px-1 py-0.5 rounded">Active</span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-300 mt-0.5 sm:mt-1">{(stats.remarksCount || 0).toLocaleString()}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Manual check notes</p>
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Default Approved Count */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5 sm:mt-1">{stats.approvedCount.toLocaleString()}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Default state</p>
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Disapproved Count */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Disapproved</p>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-0.5 sm:mt-1">{stats.disapprovedCount.toLocaleString()}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Flagged manually</p>
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
          <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

    </div>
  );
}
