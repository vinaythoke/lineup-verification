import { Search, X, AlertTriangle, MessageSquare } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  filterMismatch,
  onMismatchChange,
  filterRequested = [],
  onRequestedChange,
  filterExpected = [],
  onExpectedChange,
  filterOrganizerStatus,
  onOrganizerStatusChange,
  filterEvidence,
  onEvidenceChange,
  filterRemarks = 'ALL',
  onRemarksChange,
  onResetFilters,
  totalFilteredCount,
  totalCount,
  showEmail = false
}) {
  const isAnyFilterActive = 
    searchQuery || 
    filterMismatch || 
    filterRequested.length > 0 || 
    filterExpected.length > 0 || 
    filterOrganizerStatus !== 'ALL' || 
    filterEvidence !== 'ALL' ||
    filterRemarks !== 'ALL';

  const toggleArrayOption = (currentArr, option, onChange) => {
    if (currentArr.includes(option)) {
      onChange(currentArr.filter(item => item !== option));
    } else {
      onChange([...currentArr, option]);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl backdrop-blur-md">
      
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

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Quick Filter: Show Mismatches Only */}
          <button
            onClick={() => onMismatchChange(!filterMismatch)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer shrink-0 active:scale-95 ${
              filterMismatch
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-amber-400 border-amber-500/30 hover:border-amber-500/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Discrepancies Only</span>
          </button>

          {/* Quick Filter: Has Remarks Only */}
          <button
            onClick={() => onRemarksChange(filterRemarks === 'WITH_REMARKS' ? 'ALL' : 'WITH_REMARKS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer shrink-0 active:scale-95 ${
              filterRemarks === 'WITH_REMARKS'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/20'
                : 'bg-slate-950 text-purple-300 border-purple-500/30 hover:border-purple-500/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Has Dev Remarks Only</span>
          </button>
        </div>
      </div>

      {/* Multi-Select Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80">
        
        {/* Multi-Select Requested Lineup */}
        <div className="sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-300">
              Requested Lineup <span className="text-[10px] text-slate-500 font-normal">(Multi-select)</span>
            </label>
            {filterRequested.length > 0 && (
              <button 
                onClick={() => onRequestedChange([])} 
                className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['E', 'A', 'B'].map((section) => {
              const isSelected = filterRequested.includes(section);
              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => toggleArrayOption(filterRequested, section, onRequestedChange)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  Lineup {section}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Select AI Result Lineup */}
        <div className="sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-300">
              AI Result Lineup <span className="text-[10px] text-slate-500 font-normal">(Multi-select)</span>
            </label>
            {filterExpected.length > 0 && (
              <button 
                onClick={() => onExpectedChange([])} 
                className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'E', label: 'E' },
              { id: 'A', label: 'A' },
              { id: 'B', label: 'B' },
              { id: 'C', label: 'C' },
              { id: 'UNSPECIFIED', label: 'Blank (-)' }
            ].map((item) => {
              const isSelected = filterExpected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleArrayOption(filterExpected, item.id, onExpectedChange)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? item.id === 'C'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                        : 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audit Remarks Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Dev Remarks</label>
          <select
            value={filterRemarks}
            onChange={(e) => onRemarksChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Records</option>
            <option value="WITH_REMARKS">Has Remarks Only 💬</option>
            <option value="NO_REMARKS">No Remarks</option>
          </select>
        </div>

        {/* Organizer Review Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Organizer Status</label>
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

      </div>

      {/* Filter Summary Row */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div>
          Showing <strong className="text-white">{totalFilteredCount}</strong> of <strong>{totalCount}</strong> runners
        </div>

        {isAnyFilterActive && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>

    </div>
  );
}
