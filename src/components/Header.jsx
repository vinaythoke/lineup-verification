import React from 'react';
import { Award, Download, Globe, RefreshCw, Sun, Moon } from 'lucide-react';

export default function Header({ 
  bunnyCdnUrl, 
  totalCount, 
  disapprovedCount, 
  onExport, 
  onResetAll,
  isDarkMode,
  onToggleTheme
}) {
  return (
    <header className="glass-panel sticky top-0 z-30 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-500/15">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Satara Hill Half Marathon
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-semibold tracking-wide">
                Verification Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Organizer manual audit for runner proof of performance & lineups
            </p>
          </div>
        </div>

        {/* CDN Info, Theme Toggle & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* CDN Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-400">CDN:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">{bunnyCdnUrl}</span>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Reset Decisions Button */}
          {onResetAll && (
            <button
              onClick={onResetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Export Report Button */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
            {disapprovedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                {disapprovedCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
