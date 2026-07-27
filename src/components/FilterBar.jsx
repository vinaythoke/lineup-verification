import React from 'react';
import { Search, X, AlertTriangle, Filter, ShieldCheck, FileCheck } from 'lucide-react';
import CustomSelect from './CustomSelect.jsx';

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

  const requestedOptions = [
    { value: 'ALL', label: 'All Requested (E, A, B)' },
    { value: 'E', label: 'Lineup E (Elite)' },
    { value: 'A', label: 'Lineup A' },
    { value: 'B', label: 'Lineup B' }
  ];

  const expectedOptions = [
    { value: 'ALL', label: 'All AI Results (E, A, B, C)' },
    { value: 'E', label: 'Lineup E (Elite)' },
    { value: 'A', label: 'Lineup A' },
    { value: 'B', label: 'Lineup B' },
    { value: 'C', label: 'Lineup C (Demoted)' }
  ];

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'APPROVED', label: 'Approved (Default)' },
    { value: 'DISAPPROVED', label: 'Disapproved Only ⚠️' }
  ];

  const evidenceOptions = [
    { value: 'ALL', label: 'All Proof Types' },
    { value: 'Certificate only', label: 'Certificate only' },
    { value: 'Link only', label: 'Result Link only' },
    { value: 'Both', label: 'Both Certificate & Link' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 mb-6 shadow-sm">
      
      {/* Top Search & Mismatch Quick Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={showEmail ? "Search runner by Name, Email, or Reg ID..." : "Search runner by Name or Reg ID..."}
            className="w-full pl-10 pr-10 py-2.5 bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter: Show Discrepancies Only */}
        <button
          onClick={() => onMismatchChange(!filterMismatch)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 ${
            filterMismatch
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-white/70 dark:bg-slate-900/80 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Show Discrepancies Only</span>
        </button>

      </div>

      {/* Custom Popover Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
        
        <CustomSelect
          label="Requested Lineup"
          value={filterRequested}
          options={requestedOptions}
          onChange={onRequestedChange}
          icon={Filter}
        />

        <CustomSelect
          label="AI Result Lineup"
          value={filterExpected}
          options={expectedOptions}
          onChange={onExpectedChange}
          icon={Filter}
        />

        <CustomSelect
          label="Organizer Status"
          value={filterOrganizerStatus}
          options={statusOptions}
          onChange={onOrganizerStatusChange}
          icon={ShieldCheck}
        />

        <CustomSelect
          label="Proof Type"
          value={filterEvidence}
          options={evidenceOptions}
          onChange={onEvidenceChange}
          icon={FileCheck}
        />

        {/* Reset & Filter Stats */}
        <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-end justify-between lg:justify-end gap-2 pt-1 lg:pt-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 self-center">
            Showing <strong className="text-slate-900 dark:text-white font-bold">{totalFilteredCount}</strong> of {totalCount}
          </span>
          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer self-center ml-2"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
