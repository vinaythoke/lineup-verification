import { Award, Download, Globe, RefreshCw, Lock } from 'lucide-react';

export default function Header({ bunnyCdnUrl, totalCount: _totalCount, disapprovedCount, onExport, onResetAll, onLock }) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Satara Hill Half Marathon</h1>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
                Verification Tool
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Manual verification portal for runner past finish times & certificates
            </p>
          </div>
        </div>

        {/* CDN Info & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t border-slate-800/80 md:border-0">
          
          {/* GitHub Live Sync Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[11px]">GitHub Permanent Sync</span>
          </div>

          {/* CDN Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 max-w-full sm:max-w-none">
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-slate-400 text-[11px]">CDN:</span>
            <span className="font-mono text-indigo-300 font-medium text-[11px] truncate max-w-[140px] sm:max-w-none">{bunnyCdnUrl}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset Progress Button */}
            {onResetAll && (
              <button
                onClick={onResetAll}
                title="Reset all manual organizer decisions back to default"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Decisions</span>
                <span className="sm:hidden">Reset</span>
              </button>
            )}

            {/* Export Report Button */}
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {disapprovedCount > 0 ? `(${disapprovedCount})` : ''}</span>
            </button>

            {/* Lock Session Button */}
            {onLock && (
              <button
                onClick={onLock}
                title="Lock current session and require PIN to re-enter"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-700/50 border border-slate-700 text-xs font-medium text-slate-400 hover:text-rose-300 transition cursor-pointer active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
