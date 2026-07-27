import React, { useState } from 'react';
import { Download, X, FileSpreadsheet } from 'lucide-react';

export default function ExportModal({ runners, organizerDecisions, onClose }) {
  const [exportType, setExportType] = useState('ALL');

  const disapprovedCount = Object.values(organizerDecisions).filter(d => d.status === 'DISAPPROVED').length;

  const handleDownloadCSV = () => {
    let dataset = runners;
    if (exportType === 'DISAPPROVED_ONLY') {
      dataset = runners.filter(r => organizerDecisions[r.id]?.status === 'DISAPPROVED');
    }

    const headers = [
      'Registration ID',
      'Runner Name',
      'Email',
      'Requested Lineup',
      'Claimed Race Type',
      'Claimed Finish Time',
      'AI Result Lineup',
      'AI Verified Race Type',
      'AI Verified Finish Time',
      'Organizer Decision',
      'Final Allotted Lineup',
      'Organizer Note / Reason',
      'Result Link',
      'Certificate File Path'
    ];

    const rows = dataset.map(r => {
      const dec = organizerDecisions[r.id] || { status: 'APPROVED' };
      const finalLineup = dec.status === 'DISAPPROVED' ? (dec.assignedLineup || 'C') : (r.expectedLineup || 'C');
      return [
        `"${r.id}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${r.requestedLineup || ''}"`,
        `"${r.claimedRaceType || ''}"`,
        `"${r.claimedFinishTime || ''}"`,
        `"${r.expectedLineup || ''}"`,
        `"${r.verifiedRaceType || ''}"`,
        `"${r.verifiedFinishTime || ''}"`,
        `"${dec.status}"`,
        `"${finalLineup}"`,
        `"${(dec.note || '').replace(/"/g, '""')}"`,
        `"${r.resultLinkClean || r.resultLinkRaw || ''}"`,
        `"${r.certificateFile || ''}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `satara_lineup_verification_report_${exportType.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Export Audit Report</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download formatted CSV report for organizers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Selection Cards */}
        <div className="space-y-3 mb-6">
          
          <label 
            onClick={() => setExportType('ALL')}
            className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition duration-150 ${
              exportType === 'ALL'
                ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-500 shadow-sm ring-1 ring-indigo-500/50'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="exportType"
              checked={exportType === 'ALL'}
              onChange={() => setExportType('ALL')}
              className="mt-1 accent-indigo-600"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Export All Records ({runners.length})</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Complete dataset of 3,104 runners with final allotted lineup.</div>
            </div>
          </label>

          <label 
            onClick={() => setExportType('DISAPPROVED_ONLY')}
            className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition duration-150 ${
              exportType === 'DISAPPROVED_ONLY'
                ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-500 shadow-sm ring-1 ring-rose-500/50'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="exportType"
              checked={exportType === 'DISAPPROVED_ONLY'}
              onChange={() => setExportType('DISAPPROVED_ONLY')}
              className="mt-1 accent-rose-600"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Export Disapproved Only ({disapprovedCount})
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Export only runners flagged or reassigned by organizers.</div>
            </div>
          </label>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

      </div>

    </div>
  );
}
