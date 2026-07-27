import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw, 
  ExternalLink, FileText, CheckCircle, XCircle, AlertTriangle 
} from 'lucide-react';

export default function CertificateModal({ 
  runner, 
  fullCertUrl, 
  onClose, 
  onPrev, 
  onNext, 
  hasPrev, 
  hasNext,
  organizerDecision,
  onToggleStatus,
  showEmail = false
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setImageError(false);
  }, [runner]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      else if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!runner) return null;

  const isPdf = runner.certificateType === 'pdf';
  const isDisapproved = organizerDecision?.status === 'DISAPPROVED';
  const assignedLineup = organizerDecision?.assignedLineup || 'C';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          
          {/* Runner Summary */}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{runner.name}</h2>
              <button
                onClick={() => onToggleStatus(runner.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition shadow-sm ${
                  isDisapproved 
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 hover:bg-rose-500/25' 
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                }`}
              >
                {isDisapproved ? <XCircle className="w-3.5 h-3.5 text-rose-500" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{isDisapproved ? `Disapproved (Lineup ${assignedLineup})` : 'Approved'}</span>
              </button>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
              {showEmail && (
                <>
                  <span>{runner.email || 'No email'}</span>
                  <span>•</span>
                </>
              )}
              <span>Claimed: <strong className="text-amber-600 dark:text-amber-300">Lineup {runner.requestedLineup}</strong></span>
              <span>•</span>
              <span>AI Result: <strong className="text-indigo-600 dark:text-indigo-300">Lineup {runner.expectedLineup}</strong></span>
              {isDisapproved && (
                <>
                  <span>•</span>
                  <span>Assigned: <strong className="text-rose-600 dark:text-rose-400">Lineup {assignedLineup}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center gap-2">
            
            {/* Image Zoom & Rotate Controls */}
            {!isPdf && !imageError && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-300/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                <button
                  onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                  className="p-1.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full cursor-pointer transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono w-10 text-center font-bold">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                  className="p-1.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full cursor-pointer transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="p-1.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full cursor-pointer transition"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Direct Download */}
            {fullCertUrl && (
              <a
                href={fullCertUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                title="Download Certificate"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-rose-500/20 border border-slate-300/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition cursor-pointer"
              title="Close Modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Viewer Content Area */}
        <div className="flex-1 bg-slate-900 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
          
          {/* Previous Arrow */}
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="absolute left-4 z-20 p-3 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition cursor-pointer"
            title="Previous Certificate (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="absolute right-4 z-20 p-3 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition cursor-pointer"
            title="Next Certificate (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Display PDF or Image */}
          {isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <iframe
                src={fullCertUrl}
                title={`Certificate for ${runner.name}`}
                className="w-full h-full rounded-2xl border border-slate-800 bg-white"
              />
            </div>
          ) : imageError ? (
            <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">Certificate Preview Unavailable</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unable to load image directly from CDN. Please check CDN connection or download file directly.
              </p>
              <a
                href={fullCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-xs font-semibold text-white transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open File in New Tab
              </a>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={fullCertUrl}
                alt={`Certificate for ${runner.name}`}
                onError={() => setImageError(true)}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          )}

        </div>

        {/* Footer Info Bar */}
        <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span className="font-mono text-slate-700 dark:text-slate-300">{runner.certificateFile}</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            Use <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]">→</kbd> keys to navigate
          </div>
        </div>

      </div>

    </div>
  );
}
