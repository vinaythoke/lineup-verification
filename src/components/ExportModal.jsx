import { useState } from 'react';
import { Download, X, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function ExportModal({ runners, organizerDecisions, onClose }) {
  const [exportType, setExportType] = useState('ALL'); // 'ALL' or 'DISAPPROVED_ONLY'
  const [isExporting, setIsExporting] = useState(false);

  const disapprovedCount = Object.values(organizerDecisions).filter(d => d.status === 'DISAPPROVED').length;

  const handleDownloadCSV = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
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
          'Dev Audit Remarks',
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
            `"${(r.remarks || '').replace(/"/g, '""')}"`,
            `"${dec.status}"`,
            `"${finalLineup}"`,
            `"${(dec.note || '').replace(/"/g, '""')}"`,
            `"${r.resultLinkClean || r.resultLinkRaw || ''}"`,
            `"${r.certificateFile || ''}"`
          ].join(',');
        });

        // Add UTF-8 BOM (\uFEFF) and \r\n line endings
        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
        const fileName = `satara_lineup_verification_report_${exportType.toLowerCase()}.csv`;

        // Base64 Data URL payload for 100% instant, self-contained cross-browser download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const dataUrl = reader.result;
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
            setIsExporting(false);
            onClose();
          }, 600);
        };

        reader.readAsDataURL(blob);

      } catch (err) {
        console.error('Export failed:', err);
        setIsExporting(false);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Export Audit Report</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Download a CSV report containing runner registration data, AI verification results, and organizer manual decisions.
        </p>

        {/* Option Selection */}
        <div className="space-y-3 mb-6">
          
          <label 
            onClick={() => !isExporting && setExportType('ALL')}
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              exportType === 'ALL'
                ? 'bg-indigo-600/15 border-indigo-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name="exportType"
              disabled={isExporting}
              checked={exportType === 'ALL'}
              onChange={() => setExportType('ALL')}
              className="mt-1 accent-indigo-500"
            />
            <div>
              <div className="text-xs font-semibold text-slate-100">Export All Records ({runners.length})</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Complete list of all 3,104 runners with organizer decision flags.</div>
            </div>
          </label>

          <label 
            onClick={() => !isExporting && setExportType('DISAPPROVED_ONLY')}
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              exportType === 'DISAPPROVED_ONLY'
                ? 'bg-rose-600/15 border-rose-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name="exportType"
              disabled={isExporting}
              checked={exportType === 'DISAPPROVED_ONLY'}
              onChange={() => setExportType('DISAPPROVED_ONLY')}
              className="mt-1 accent-rose-500"
            />
            <div>
              <div className="text-xs font-semibold text-slate-100">
                Export Disapproved / Flagged Only ({disapprovedCount})
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Filter for runners flagged by organizers for section reassignment or disqualification.</div>
            </div>
          </label>

        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing CSV...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download CSV Report</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
