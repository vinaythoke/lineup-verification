import React from 'react';
import { Search, Filter, X, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  filterMismatch,
  onMismatchChange,
  filterRequested,
  onRequestedChange,
  filterExpected,
  onExpectedChange,
  filterOrganizerStatus,
  onOrganizerStatusChange,
  filterEvidence,
  onEvidenceChange,
  onResetFilters,
  totalFilteredCount,
  totalCount,
  showEmail = false
}) {
  const isAnyFilterActive = 
    searchQuery || 
    filterMismatch || 
    filterRequested !== 'ALL' || 
    filterExpected !== 'ALL' || 
    filterOrganizerStatus !== 'ALL' || 
    filterEvidence !== 'ALL';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl backdrop-blur-md">
      
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={showEmail ? "Search by Runner Name, Email, or Registration ID..." : "Search by Runner Name or Registration ID..."}
            className="w-full pl-10 pr-10 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter: Show Mismatches Only Toggle */}
        <button
          onClick={() => onMismatchChange(!filterMismatch)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer shrink-0 ${
            filterMismatch
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-950 text-amber-400 border-amber-500/30 hover:border-amber-500/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Show Lineup Discrepancies Only</span>
        </button>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
        
        {/* Requested Lineup */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Requested Lineup</label>
          <select
            value={filterRequested}
            onChange={(e) => onRequestedChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Requested (E, A, B)</option>
            <option value="E">Lineup E (Elite)</option>
            <option value="A">Lineup A</option>
            <option value="B">Lineup B</option>
          </select>
        </div>

        {/* AI Expected Lineup */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">AI Result Lineup</label>
          <select
            value={filterExpected}
            onChange={(e) => onExpectedChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All AI Results (E, A, B, C)</option>
            <option value="E">Lineup E (Elite)</option>
            <option value="A">Lineup A</option>
            <option value="B">Lineup B</option>
            <option value="C">Lineup C (Demoted / Invalid)</option>
          </select>
        </div>

        {/* Organizer Review Status */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Organizer Status</label>
          <select
            value={filterOrganizerStatus}
            onChange={(e) => onOrganizerStatusChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved (Default)</option>
            <option value="DISAPPROVED">Disapproved Only ⚠️</option>
          </select>
        </div>

        {/* Evidence Provided */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Proof Provided</label>
          <select
            value={filterEvidence}
            onChange={(e) => onEvidenceChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Evidence Types</option>
            <option value="Certificate only">Certificate only</option>
            <option value="Link only">Result Link only</option>
            <option value="Both">Both Certificate & Link</option>
          </select>
        </div>

        {/* Filter Summary & Clear Button */}
        <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-end justify-between lg:justify-end gap-2">
          <span className="text-xs text-slate-400 self-center">
            Showing <strong className="text-white">{totalFilteredCount}</strong> of {totalCount}
          </span>
          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer self-center"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
