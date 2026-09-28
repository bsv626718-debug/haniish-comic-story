import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe, ExternalLink } from 'lucide-react';
import { ComicProject } from '../types/comic';

interface ShareModalProps {
  project: ComicProject;
  isOpen: boolean;
  onClose: () => void;
  onOpenReader: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenReader,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-[#120716] border border-rose-900/70 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-white">Share Comic Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Private Project Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-[#18091d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-zinc-300 space-y-2">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Public Reading Access</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Anyone with this link can view the illustrated comic panels and read dialogue bubbles in high definition.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenReader();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            <span>Launch Reader Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
