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

    // Call onConfirm with new status & reassigned lineup
    onConfirm(runner.id, assignedLineup, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Disapprove / Reassign Runner</h3>
              <p className="text-xs text-slate-400">Modify final lineup allotment for this runner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Runner Info Summary Banner */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 mb-5 text-xs">
          <div className="font-semibold text-slate-200 text-sm">{runner.name}</div>
          <div className="text-slate-400 font-mono text-[11px] mt-0.5">{runner.id}</div>
          
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-500">Requested:</span>{' '}
              <strong className="text-amber-300">Lineup {runner.requestedLineup}</strong>
            </div>
            <div>
              <span className="text-slate-500">AI Result:</span>{' '}
              <strong className="text-indigo-300">Lineup {runner.expectedLineup}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Reassign Final Lineup Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Allot Final Lineup Section <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['E', 'A', 'B', 'C'].map((section) => {
                const isSelected = assignedLineup === section;
                return (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setAssignedLineup(section)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? section === 'C'
                          ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                          : 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>Lineup {section}</span>
                    {section === 'C' && <span className="text-[9px] opacity-80 font-normal">(Default)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason / Organizer Note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Organizer Note / Reason <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. 10KM certificate submitted, invalid proof time, etc."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          {/* Security PIN Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Organizer Security PIN</span> <span className="text-rose-400">*</span>
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN to authorize change"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Disapproval & Lineup
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
