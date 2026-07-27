import React, { useState } from 'react';
import { 
  FileText, ExternalLink, AlertTriangle, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Info, ArrowRight
} from 'lucide-react';

export default function RunnerTable({ 
  runners, 
  bunnyCdnUrl, 
  organizerDecisions, 
  onToggleStatus, 
  onOpenCertificate,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showEmail = false
}) {
  const [sortField, setSortField] = useState('index');
  const [sortOrder, setSortOrder] = useState('asc');

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sort Runners
  const sortedRunners = [...runners].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'organizerStatus') {
      valA = organizerDecisions[a.id]?.status || 'APPROVED';
      valB = organizerDecisions[b.id]?.status || 'APPROVED';
    }

    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    if (typeof valA === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  // Paginate
  const totalPages = Math.ceil(sortedRunners.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRunners = sortedRunners.slice(startIndex, startIndex + pageSize);

  // Lineup Badge Pill Stylings
  const renderLineupPill = (section, label = '') => {
    if (!section) return <span className="text-slate-400 font-mono text-xs">-</span>;
    
    let style = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
    if (section === 'E') style = "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold";
    else if (section === 'A') style = "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 font-bold";
    else if (section === 'B') style = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold";
    else if (section === 'C') style = "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 font-bold";

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${style}`}>
        {label && <span className="text-[10px] font-normal opacity-70 uppercase tracking-wider">{label}</span>}
        <span>Lineup {section}</span>
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
              
              {/* Runner Info */}
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5">
                  <span>Runner Details</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>

              {/* Lineup Allocation Flow */}
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition" onClick={() => handleSort('expectedLineup')}>
                <div className="flex items-center gap-1.5">
                  <span>Lineup Allocation (Claimed ➔ AI Result)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>

              {/* Race Timings */}
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition" onClick={() => handleSort('claimedFinishTime')}>
                <div className="flex items-center gap-1.5">
                  <span>Race Proof Details</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>

              {/* Organizer Decision */}
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition text-center" onClick={() => handleSort('organizerStatus')}>
                <div className="flex items-center justify-center gap-1.5">
                  <span>Organizer Decision</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>

              {/* Actions */}
              <th className="py-3.5 px-4 text-right">Verification Actions</th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
            {paginatedRunners.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  No runners match your search & filter criteria.
                </td>
              </tr>
            ) : (
              paginatedRunners.map((runner) => {
                const decision = organizerDecisions[runner.id] || { status: 'APPROVED' };
                const isDisapproved = decision.status === 'DISAPPROVED';
                const fullCertUrl = runner.certificateFile 
                  ? `${bunnyCdnUrl.replace(/\/$/, '')}/${runner.certificateFile}`
                  : null;

                return (
                  <tr 
                    key={runner.id} 
                    className={`transition duration-150 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 ${
                      isDisapproved 
                        ? 'bg-rose-500/5 dark:bg-rose-950/20' 
                        : runner.isMismatch 
                          ? 'bg-amber-500/5 dark:bg-amber-950/10' 
                          : ''
                    }`}
                  >
                    
                    {/* Runner Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">{runner.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        {showEmail && (
                          <>
                            <span className="truncate max-w-[160px]">{runner.email || 'No email'}</span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                          </>
                        )}
                        <span className="font-mono text-slate-400 dark:text-slate-500 text-[10px] bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {runner.id}
                        </span>
                      </div>
                    </td>

                    {/* Prominent Lineup Section Flow */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        
                        {/* Claimed Lineup */}
                        {renderLineupPill(runner.requestedLineup, 'Claimed')}
                        
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        
                        {/* AI Result Lineup */}
                        {renderLineupPill(runner.expectedLineup, 'AI Result')}

                        {/* Lineup Discrepancy Alert */}
                        {runner.isMismatch && !isDisapproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30" title="Requested lineup differs from AI verified lineup!">
                            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>Mismatch</span>
                          </span>
                        )}

                        {/* Organizer Override Pill */}
                        {isDisapproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40" title="Manually reassigned by organizer">
                            <span>✋ Organizer: Lineup {decision.assignedLineup || 'C'}</span>
                          </span>
                        )}

                      </div>
                    </td>

                    {/* Race Proof Details */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Claimed: <span className="capitalize">{runner.claimedRaceType || 'N/A'}</span>
                        {runner.claimedFinishTime && (
                          <span className="ml-1 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">({runner.claimedFinishTime})</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Verified: <span className="capitalize">{runner.verifiedRaceType || runner.verificationSource || 'N/A'}</span>
                        {runner.verifiedFinishTime && (
                          <span className="ml-1 font-mono text-slate-700 dark:text-slate-300">({runner.verifiedFinishTime})</span>
                        )}
                      </div>
                    </td>

                    {/* Organizer Status Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <button
                          onClick={() => onToggleStatus(runner.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer shadow-sm ${
                            isDisapproved
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 hover:bg-rose-500/25'
                              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                          }`}
                        >
                          {isDisapproved ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              <span>Disapproved (Lineup {decision.assignedLineup || 'C'})</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Approved</span>
                            </>
                          )}
                        </button>
                        {decision.note && (
                          <span className="text-[10px] text-rose-600 dark:text-rose-300/80 italic mt-1 max-w-[140px] truncate" title={decision.note}>
                            "{decision.note}"
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* View Certificate */}
                        {runner.certificateFile ? (
                          <button
                            onClick={() => onOpenCertificate(runner, fullCertUrl)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition cursor-pointer shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic px-2">No Cert</span>
                        )}

                        {/* View Result Link */}
                        {runner.resultLinkClean ? (
                          <a
                            href={runner.resultLinkClean}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/15 hover:bg-purple-100 dark:hover:bg-purple-500/25 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold transition shadow-sm"
                            title={runner.resultLinkRaw}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Link</span>
                          </a>
                        ) : runner.resultLinkRaw ? (
                          <span 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] max-w-[100px] truncate cursor-help" 
                            title={`Raw text: "${runner.resultLinkRaw}"`}
                          >
                            <Info className="w-3 h-3 shrink-0 text-slate-400" />
                            <span>{runner.resultLinkRaw}</span>
                          </span>
                        ) : null}

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-100/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none cursor-pointer"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <span className="ml-2">
            Showing <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + pageSize, sortedRunners.length)}</strong> of <strong>{sortedRunners.length}</strong> runners
          </span>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 font-semibold text-slate-800 dark:text-slate-200">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
