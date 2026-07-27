import { useState } from 'react';
import { 
  FileText, ExternalLink, AlertTriangle, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Info
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

  // Lineup Badge Styling
  const renderLineupBadge = (section, isExpected = false, isMismatch = false) => {
    if (!section) return <span className="text-slate-500 font-mono">-</span>;
    
    let color = "bg-slate-800 text-slate-300 border-slate-700";
    if (section === 'E') color = "bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold";
    else if (section === 'A') color = "bg-blue-500/15 text-blue-300 border-blue-500/40 font-bold";
    else if (section === 'B') color = "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold";
    else if (section === 'C') color = "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold";

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${color}`}>
        <span>Lineup {section}</span>
        {isExpected && isMismatch && (
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" title="Differs from requested section!" />
        )}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
      
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              
              {/* Runner Details */}
              <th className="py-3 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Runner Details</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>

              {/* Claimed Info */}
              <th className="py-3 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('requestedLineup')}>
                <div className="flex items-center gap-1">
                  <span>Claimed (Registration)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>

              {/* AI Verification */}
              <th className="py-3 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('expectedLineup')}>
                <div className="flex items-center gap-1">
                  <span>AI Result</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>

              {/* Organizer Review Status */}
              <th className="py-3 px-4 cursor-pointer hover:text-white transition text-center" onClick={() => handleSort('organizerStatus')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Organizer Decision</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>

              {/* Proof / Actions */}
              <th className="py-3 px-4 text-right">Proof Actions</th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-xs">
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
                    className={`transition hover:bg-slate-800/40 ${
                      isDisapproved 
                        ? 'bg-rose-950/20' 
                        : runner.isMismatch 
                          ? 'bg-amber-950/10' 
                          : ''
                    }`}
                  >
                    
                    {/* Runner Details */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 text-sm">{runner.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        {showEmail && (
                          <>
                            <span>{runner.email || 'No Email'}</span>
                            <span className="text-slate-600">•</span>
                          </>
                        )}
                        <span className="font-mono text-slate-500 text-[10px]">{runner.id}</span>
                      </div>
                    </td>

                    {/* Claimed Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {renderLineupBadge(runner.requestedLineup)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        <span className="capitalize text-slate-300 font-medium">{runner.claimedRaceType || 'N/A'}</span>
                        {runner.claimedFinishTime && (
                          <span className="ml-1.5 font-mono text-slate-200">({runner.claimedFinishTime})</span>
                        )}
                      </div>
                    </td>

                    {/* AI Verification */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {renderLineupBadge(runner.expectedLineup, true, runner.isMismatch)}
                        {isDisapproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-900/60 text-rose-200 border border-rose-500/50" title="Assigned manually by organizer">
                            ↳ Reassigned: Lineup {decision.assignedLineup || 'C'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        <span className="capitalize font-medium text-slate-300">
                          {runner.verifiedRaceType || runner.verificationSource || 'N/A'}
                        </span>
                        {runner.verifiedFinishTime && (
                          <span className="ml-1 font-mono text-slate-200">({runner.verifiedFinishTime})</span>
                        )}
                      </div>
                    </td>

                    {/* Organizer Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <button
                          onClick={() => onToggleStatus(runner.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                            isDisapproved
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                          }`}
                        >
                          {isDisapproved ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Disapproved (Lineup {decision.assignedLineup || 'C'})</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Approved</span>
                            </>
                          )}
                        </button>
                        {decision.note && (
                          <span className="text-[10px] text-rose-300/80 italic mt-1 max-w-[140px] truncate" title={decision.note}>
                            "{decision.note}"
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Proof Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* View Certificate */}
                        {runner.certificateFile ? (
                          <button
                            onClick={() => onOpenCertificate(runner, fullCertUrl)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic px-2">No Cert</span>
                        )}

                        {/* View Result Link */}
                        {runner.resultLinkClean ? (
                          <a
                            href={runner.resultLinkClean}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-medium transition"
                            title={runner.resultLinkRaw}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Link</span>
                          </a>
                        ) : runner.resultLinkRaw ? (
                          <span 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] max-w-[100px] truncate cursor-help" 
                            title={`Raw text: "${runner.resultLinkRaw}"`}
                          >
                            <Info className="w-3 h-3 shrink-0 text-slate-500" />
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
      <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
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

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 font-medium text-slate-200">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
