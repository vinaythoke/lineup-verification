import { useState } from 'react';
import { 
  FileText, ExternalLink, AlertTriangle, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Info, MessageSquare
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
      
      {/* MOBILE CARD VIEW (Visible < 768px) */}
      <div className="block md:hidden divide-y divide-slate-800/80">
        {paginatedRunners.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs px-4">
            No runners match your search & filter criteria.
          </div>
        ) : (
          paginatedRunners.map((runner) => {
            const decision = organizerDecisions[runner.id] || { status: 'APPROVED' };
            const isDisapproved = decision.status === 'DISAPPROVED';
            const fullCertUrl = runner.certificateFile 
              ? `${bunnyCdnUrl.replace(/\/$/, '')}/${runner.certificateFile}`
              : null;

            return (
              <div 
                key={runner.id}
                className={`p-4 space-y-3 transition ${
                  isDisapproved 
                    ? 'bg-rose-950/25' 
                    : runner.isMismatch 
                      ? 'bg-amber-950/15' 
                      : 'hover:bg-slate-800/30'
                }`}
              >
                {/* Header: Name & Reg ID */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">#{runner.index}</span>
                      <h3 className="font-bold text-slate-100 text-sm">{runner.name}</h3>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1 flex-wrap">
                      {showEmail && runner.email && <span>{runner.email}</span>}
                      {showEmail && runner.email && <span className="text-slate-600">•</span>}
                      <span className="font-mono text-slate-500 text-[10px]">{runner.id}</span>
                    </div>
                  </div>

                  {/* Decision Toggle Button (Mobile Touch Target) */}
                  <button
                    onClick={() => onToggleStatus(runner.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer shrink-0 active:scale-95 ${
                      isDisapproved
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isDisapproved ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Disapproved ({decision.assignedLineup || 'C'})</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Approved</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Lineup & Timing Details Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  {/* Claimed */}
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Claimed</div>
                    <div className="flex items-center gap-1">
                      {renderLineupBadge(runner.requestedLineup)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 capitalize">
                      {runner.claimedRaceType || 'N/A'} {runner.claimedFinishTime && `(${runner.claimedFinishTime})`}
                    </div>
                  </div>

                  {/* AI Result */}
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase mb-1">AI Result</div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {renderLineupBadge(runner.expectedLineup, true, runner.isMismatch)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 capitalize">
                      {runner.verifiedRaceType || runner.verificationSource || 'N/A'} {runner.verifiedFinishTime && `(${runner.verifiedFinishTime})`}
                    </div>
                  </div>
                </div>

                {/* Reassigned Badge & Notes if Disapproved */}
                {isDisapproved && (
                  <div className="flex items-center justify-between gap-2 text-xs bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                    <span className="text-rose-300 font-medium text-[11px]">
                      ↳ Reassigned: <strong className="text-white">Lineup {decision.assignedLineup || 'C'}</strong>
                    </span>
                    {decision.note && (
                      <span className="text-[10px] text-rose-300/80 italic truncate max-w-[150px]" title={decision.note}>
                        "{decision.note}"
                      </span>
                    )}
                  </div>
                )}

                {/* Dev Remarks Banner if Present */}
                {runner.remarks && (
                  <div className="flex items-start gap-1.5 text-xs bg-purple-950/40 p-2.5 rounded-lg border border-purple-500/40 text-purple-200">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-300">Dev Audit Remark: </span>
                      <span>{runner.remarks}</span>
                    </div>
                  </div>
                )}

                {/* Proof Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {runner.certificateFile ? (
                    <button
                      onClick={() => onOpenCertificate(runner, fullCertUrl)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium transition cursor-pointer active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic px-2">No Certificate</span>
                  )}

                  {runner.resultLinkClean ? (
                    <a
                      href={runner.resultLinkClean}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-medium transition active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Result Link</span>
                    </a>
                  ) : runner.resultLinkRaw ? (
                    <span 
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] max-w-[120px] truncate" 
                      title={`Raw text: "${runner.resultLinkRaw}"`}
                    >
                      <Info className="w-3 h-3 shrink-0 text-slate-500" />
                      <span>{runner.resultLinkRaw}</span>
                    </span>
                  ) : null}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible >= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              
              {/* Row Index */}
              <th className="py-3 px-3.5 w-16 text-center cursor-pointer hover:text-white transition" onClick={() => handleSort('index')}>
                <div className="flex items-center justify-center gap-1">
                  <span>#</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>

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
                <td colSpan="6" className="py-12 text-center text-slate-400">
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
                    
                    {/* Row Index */}
                    <td className="py-3 px-3.5 text-center font-mono text-xs font-bold text-indigo-300/90">
                      #{runner.index}
                    </td>
                    
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
                      {runner.remarks && (
                        <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-200 text-[11px]" title={runner.remarks}>
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="font-semibold text-purple-300">Remark:</span>
                          <span className="truncate max-w-[220px]">{runner.remarks}</span>
                        </div>
                      )}
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
      <div className="bg-slate-950/90 border-t border-slate-800 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
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
          </div>
          <span className="text-[11px] sm:text-xs">
            <strong>{startIndex + 1}</strong>-<strong>{Math.min(startIndex + pageSize, sortedRunners.length)}</strong> of <strong>{sortedRunners.length}</strong>
          </span>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center justify-center gap-1 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-800 sm:border-0">
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

          <span className="px-2.5 font-semibold text-slate-200 text-xs">
            {currentPage} / {totalPages}
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
