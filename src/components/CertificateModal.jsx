import { useState, useEffect } from 'react';
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
  const [prevRunnerId, setPrevRunnerId] = useState(runner?.id);

  // Reset zoom & rotation when runner changes during render
  if (runner?.id !== prevRunnerId) {
    setPrevRunnerId(runner?.id);
    setZoom(1);
    setRotation(0);
    setImageError(false);
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-3.5 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-2.5">
          
          {/* Runner Summary */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[180px] sm:max-w-xs">{runner.name}</h2>
              <button
                onClick={() => onToggleStatus(runner.id)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border cursor-pointer transition active:scale-95 shrink-0 ${
                  isDisapproved 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isDisapproved ? <XCircle className="w-3 h-3 text-rose-400" /> : <CheckCircle className="w-3 h-3 text-emerald-400" />}
                <span>{isDisapproved ? `Disapproved (${assignedLineup})` : 'Approved'}</span>
              </button>
            </div>
            
            <div className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
              {showEmail && runner.email && (
                <>
                  <span className="truncate max-w-[140px]">{runner.email}</span>
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
          <div className="flex items-center gap-1.5 shrink-0">
            
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
                <span className="text-[10px] font-mono w-9 text-center">{Math.round(zoom * 100)}%</span>
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
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Download Certificate"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 border border-slate-700 text-slate-300 hover:text-rose-300 transition cursor-pointer"
              title="Close Modal (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>

        {/* Viewer Content Area */}
        <div className="flex-1 bg-slate-950/90 relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
          
          {/* Previous Arrow */}
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition cursor-pointer active:scale-95"
            title="Previous Certificate (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-xl hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-900 transition cursor-pointer active:scale-95"
            title="Next Certificate (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
            <div className="text-center p-5 bg-slate-900 border border-slate-800 rounded-xl max-w-sm mx-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">Certificate Preview Unavailable</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Unable to load image directly from CDN. Please check CDN connection or download file directly.
              </p>
              <a
                href={fullCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
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
        <div className="bg-slate-950 px-3.5 sm:px-5 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[220px] sm:max-w-none">
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-mono text-slate-300 truncate">{runner.certificateFile}</span>
          </div>
          <div className="text-slate-500 hidden sm:block">
            Use <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 text-[10px]">←</kbd> and <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 text-[10px]">→</kbd> keys to navigate
          </div>
        </div>

      </div>

    </div>
  );
}
