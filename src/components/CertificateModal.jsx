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

  // Reset zoom & rotation when runner changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setImageError(false);
  }, [runner]);

  // Keyboard navigation shortcuts
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4">
          
          {/* Runner Summary */}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white">{runner.name}</h2>
              <button
                onClick={() => onToggleStatus(runner.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border cursor-pointer transition ${
                  isDisapproved 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isDisapproved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>{isDisapproved ? `Disapproved (Lineup ${assignedLineup})` : 'Approved'}</span>
              </button>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              {showEmail && (
                <>
                  <span>{runner.email || 'No email'}</span>
                  <span>•</span>
                </>
              )}
              <span>Req: <strong className="text-amber-300">Lineup {runner.requestedLineup}</strong></span>
              <span>•</span>
              <span>AI Result: <strong className="text-indigo-300">Lineup {runner.expectedLineup}</strong></span>
              {isDisapproved && (
                <>
                  <span>•</span>
                  <span>Assigned: <strong className="text-rose-400">Lineup {assignedLineup}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center gap-2">
            
            {/* Image Controls */}
            {!isPdf && !imageError && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-slate-300">
                <button
                  onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                  className="p-1 hover:bg-slate-700 rounded cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                  className="p-1 hover:bg-slate-700 rounded cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="p-1 hover:bg-slate-700 rounded cursor-pointer"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
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
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Download Certificate"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 border border-slate-700 text-slate-300 hover:text-rose-300 transition cursor-pointer"
              title="Close Modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Viewer Content Area */}
        <div className="flex-1 bg-slate-950/90 relative overflow-hidden flex items-center justify-center p-4">
          
          {/* Previous Arrow */}
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="absolute left-4 z-20 p-2.5 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition cursor-pointer"
            title="Previous Certificate (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="absolute right-4 z-20 p-2.5 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition cursor-pointer"
            title="Next Certificate (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Display PDF or Image */}
          {isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <iframe
                src={fullCertUrl}
                title={`Certificate for ${runner.name}`}
                className="w-full h-full rounded-lg border border-slate-800 bg-white"
              />
            </div>
          ) : imageError ? (
            <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">Certificate Preview Unavailable</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unable to load image directly from CDN. Please check CDN connection or download file directly.
              </p>
              <a
                href={fullCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition"
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
                className="max-h-full max-w-full object-contain rounded shadow-2xl"
              />
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-slate-300">{runner.certificateFile}</span>
          </div>
          <div className="text-slate-500">
            Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">←</kbd> and <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">→</kbd> keys to navigate
          </div>
        </div>

      </div>

    </div>
  );
}
