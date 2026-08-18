import { useState, useRef, useEffect } from 'react';
import { Award, Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Delete } from 'lucide-react';

export default function PinLockScreen({ securityPin, onUnlock }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);

  const expectedPin = String(securityPin || '1234').trim();

  // Focus input automatically on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const triggerError = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  const handleVerifyPin = (pinToTest) => {
    const entered = String(pinToTest || pin).trim();
    if (!entered) {
      triggerError('Please enter the Organizer PIN');
      return;
    }

    if (entered === expectedPin) {
      setError('');
      onUnlock();
    } else {
      triggerError('Incorrect Security PIN. Access denied.');
      setPin('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerifyPin(pin);
  };

  const handleNumpadClick = (digit) => {
    setError('');
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      // If PIN reaches expected length (usually 4 digits), auto-verify if matches
      if (nextPin.length === expectedPin.length && nextPin === expectedPin) {
        handleVerifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setError('');
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError('');
    setPin('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden select-none">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Lock Card */}
      <div className={`w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/20 mb-3.5">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Race Organizer Portal</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Satara Hill Half Marathon
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Lineup Verification & Decision Dashboard
          </p>
        </div>

        {/* Security Lock Banner */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Security Verification Required</div>
            <div className="text-[11px] text-slate-400">Enter Organizer PIN to unlock this session</div>
          </div>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setError('');
                  setPin(e.target.value);
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full pl-10 pr-11 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-center text-lg sm:text-xl font-mono tracking-[0.25em] text-amber-300 placeholder-slate-600 placeholder:tracking-normal placeholder:text-xs placeholder:font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition shadow-inner"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer transition"
                title={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 active:scale-[0.98] text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition cursor-pointer"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* On-Screen Numeric Keypad (for touch / mobile / quick clicking) */}
        <div className="mt-5 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-500 text-center font-medium mb-3">
            Quick Keypad
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumpadClick(String(num))}
                className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-200 hover:text-white font-mono text-base font-semibold transition active:scale-95 cursor-pointer shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800/70 text-slate-400 hover:text-slate-200 text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleNumpadClick('0')}
              className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-200 hover:text-white font-mono text-base font-semibold transition active:scale-95 cursor-pointer shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800/70 text-slate-400 hover:text-rose-300 flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-slate-500 flex items-center gap-1.5 z-10">
        <span>Protected Organizer Session</span>
        <span>•</span>
        <span>SHHM 2026</span>
      </div>

    </div>
  );
}
