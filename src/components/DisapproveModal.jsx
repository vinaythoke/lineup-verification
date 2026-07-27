import React, { useState } from 'react';
import { ShieldAlert, KeyRound, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DisapproveModal({ 
  runner, 
  currentDecision, 
  securityPin, 
  onConfirm, 
  onClose 
}) {
  const [assignedLineup, setAssignedLineup] = useState(
    currentDecision?.assignedLineup || 'C'
  );
  const [pinInput, setPinInput] = useState('');
  const [note, setNote] = useState(currentDecision?.note || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // PIN Validation
    if (!pinInput) {
      setErrorMsg('Please enter the Security PIN to confirm this change.');
      return;
    }

    const expectedPin = String(securityPin || '1234').trim();
    if (String(pinInput).trim() !== expectedPin) {
      setErrorMsg('Incorrect Security PIN. Record was not changed.');
      return;
    }

    onConfirm(runner.id, assignedLineup, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Disapprove & Reassign Lineup</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set final lineup allotment & authorize with PIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Runner Summary Banner */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 mb-5 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">{runner.name}</div>
          <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px] mt-0.5">{runner.id}</div>
          
          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-500">Claimed:</span>{' '}
              <strong className="text-amber-600 dark:text-amber-300 font-semibold">Lineup {runner.requestedLineup}</strong>
            </div>
            <div>
              <span className="text-slate-500">AI Result:</span>{' '}
              <strong className="text-indigo-600 dark:text-indigo-300 font-semibold">Lineup {runner.expectedLineup}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Reassign Final Lineup Segment Control */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Allot Final Lineup Section <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {['E', 'A', 'B', 'C'].map((section) => {
                const isSelected = assignedLineup === section;
                return (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setAssignedLineup(section)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition duration-150 cursor-pointer flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? section === 'C'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Lineup {section}</span>
                    {section === 'C' && <span className="text-[9px] opacity-80 font-normal">(Default)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Organizer Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Organizer Note / Reason <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. 10KM certificate submitted, invalid proof time, etc."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition"
            />
          </div>

          {/* Security PIN Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Organizer Security PIN</span> <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Security PIN to authorize"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-600 dark:text-amber-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
              autoFocus
            />
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-600 dark:text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Reassign</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
