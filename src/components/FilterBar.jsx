import { useState, useRef, useEffect } from 'react';
import { Search, X, AlertTriangle, MessageSquare, ChevronDown, Check } from 'lucide-react';

function MultiSelectDropdown({ 
  label, 
  options, 
  selectedValues = [], 
  onChange, 
  placeholder = "All" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(item => item !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0 || selectedValues.length === options.length) {
      return placeholder;
    }
    const selectedLabels = options
      .filter(opt => selectedValues.includes(opt.value))
      .map(opt => opt.label);
    if (selectedLabels.length <= 2) return selectedLabels.join(', ');
    return `${selectedLabels.length} Selected`;
  };

  const isFiltered = selectedValues.length > 0 && selectedValues.length < options.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-medium text-slate-400 mb-1">{label}</label>
      
      {/* Dropdown Box Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-950 border rounded-lg px-2.5 py-1.5 text-xs text-left flex items-center justify-between transition cursor-pointer ${
          isFiltered 
            ? 'border-indigo-500 text-indigo-300 font-semibold bg-indigo-500/10' 
            : 'border-slate-700/80 text-slate-200 hover:border-slate-600'
        }`}
      >
        <span className="truncate pr-1">{getDisplayText()}</span>
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {isFiltered && (
            <span 
              onClick={(e) => { e.stopPropagation(); onChange([]); }}
              className="p-0.5 hover:text-white hover:bg-slate-800 rounded"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
        </div>
      </button>

      {/* Floating Checkbox Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 text-xs space-y-0.5 animate-fade-in min-w-[160px]">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] text-slate-400 font-semibold border-b border-slate-800 mb-1">
            <span>Select Multiple</span>
            {selectedValues.length > 0 && (
              <button 
                type="button"
                onClick={() => onChange([])} 
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {options.map((opt) => {
            const isChecked = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition select-none ${
                  isChecked 
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{opt.label}</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                  isChecked ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 bg-slate-950'
                }`}>
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SingleSelectDropdown({ 
  label, 
  options, 
  value, 
  onChange 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOpt = options.find(opt => opt.value === value) || options[0];
  const isFiltered = value !== 'ALL';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-medium text-slate-400 mb-1">{label}</label>
      
      {/* Dropdown Box Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-950 border rounded-lg px-2.5 py-1.5 text-xs text-left flex items-center justify-between transition cursor-pointer ${
          isFiltered 
            ? 'border-indigo-500 text-indigo-300 font-semibold bg-indigo-500/10' 
            : 'border-slate-700/80 text-slate-200 hover:border-slate-600'
        }`}
      >
        <span className="truncate pr-1">{selectedOpt ? selectedOpt.label : 'Select'}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 text-xs space-y-0.5 animate-fade-in min-w-[160px]">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition select-none ${
                  isSelected 
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

  const requestedOptions = [
    { value: 'E', label: 'Lineup E (Elite)' },
    { value: 'A', label: 'Lineup A' },
    { value: 'B', label: 'Lineup B' }
  ];

  const expectedOptions = [
    { value: 'E', label: 'Lineup E (Elite)' },
    { value: 'A', label: 'Lineup A' },
    { value: 'B', label: 'Lineup B' },
    { value: 'C', label: 'Lineup C (Demoted)' },
    { value: 'UNSPECIFIED', label: 'Blank / Unassigned (-)' }
  ];

  const remarksOptions = [
    { value: 'ALL', label: 'All Records' },
    { value: 'WITH_REMARKS', label: 'Has Remarks Only 💬' },
    { value: 'NO_REMARKS', label: 'No Remarks' }
  ];

  const organizerStatusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'APPROVED', label: 'Approved (Default)' },
    { value: 'DISAPPROVED', label: 'Disapproved Only ⚠️' }
  ];

  const evidenceOptions = [
    { value: 'ALL', label: 'All Evidence Types' },
    { value: 'Certificate only', label: 'Certificate only' },
    { value: 'Link only', label: 'Result Link only' },
    { value: 'Both', label: 'Both Cert & Link' }
  ];

  return (
    <div className="relative z-20 bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl backdrop-blur-md">
      
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

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
        
        {/* Multi-Select Dropdown: Requested Lineup */}
        <MultiSelectDropdown
          label="Requested Lineup"
          options={requestedOptions}
          selectedValues={filterRequested}
          onChange={onRequestedChange}
          placeholder="All Requested (E, A, B)"
        />

        {/* Multi-Select Dropdown: AI Result Lineup */}
        <MultiSelectDropdown
          label="AI Result Lineup"
          options={expectedOptions}
          selectedValues={filterExpected}
          onChange={onExpectedChange}
          placeholder="All AI Results (E, A, B, C, -)"
        />

        {/* Single-Select Dropdown: Audit Remarks */}
        <SingleSelectDropdown
          label="Dev Remarks"
          options={remarksOptions}
          value={filterRemarks}
          onChange={onRemarksChange}
        />

        {/* Single-Select Dropdown: Organizer Status */}
        <SingleSelectDropdown
          label="Organizer Status"
          options={organizerStatusOptions}
          value={filterOrganizerStatus}
          onChange={onOrganizerStatusChange}
        />

        {/* Single-Select Dropdown: Proof Provided */}
        <SingleSelectDropdown
          label="Proof Provided"
          options={evidenceOptions}
          value={filterEvidence}
          onChange={onEvidenceChange}
        />

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
