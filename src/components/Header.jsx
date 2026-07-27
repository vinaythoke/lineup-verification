import React from 'react';
import { Award, Download, Globe, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Header({ bunnyCdnUrl, totalCount, disapprovedCount, onExport, onResetAll }) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Satara Hill Half Marathon</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                Organizer Verification Tool
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manual verification portal for runner past finish times & certificates
            </p>
          </div>
        </div>

        {/* CDN Info & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* CDN Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">CDN:</span>
            <span className="font-mono text-emerald-300 font-medium">{bunnyCdnUrl}</span>
          </div>

          {/* Reset Progress Button */}
          {onResetAll && (
            <button
              onClick={onResetAll}
              title="Reset all manual organizer decisions back to default"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Decisions
            </button>
          )}

          {/* Export Report Button */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Report ({disapprovedCount > 0 ? `${disapprovedCount} Disapproved` : 'Full List'})
          </button>
        </div>

      </div>
    </header>
  );
}
