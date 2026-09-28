import React, { useState } from 'react';
import { X, FileText, Download, Check, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { ComicProject, ComicPanel } from '../types/comic';

interface ExportModalProps {
  project: ComicProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [themeMode, setThemeMode] = useState<'dark' | 'classic'>('dark');

  const activeStory =
    project.stories.find((s) => s.id === project.activeStoryId) ||
    project.stories[0];

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    setDownloadSuccess(false);

    try {
      // Create jsPDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Cover Page
      if (themeMode === 'dark') {
        doc.setFillColor(12, 5, 13);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setTextColor(244, 63, 94);
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setTextColor(225, 29, 72);
      }

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text(project.title, pageWidth / 2, 60, { align: 'center' });

      // Subtitle / Chapter
      doc.setFontSize(14);
      doc.setTextColor(themeMode === 'dark' ? 200 : 80);
      doc.text(`Chapter: ${activeStory.title}`, pageWidth / 2, 75, {
        align: 'center',
      });

      // Genre & Art Style
      doc.setFontSize(11);
      doc.setTextColor(themeMode === 'dark' ? 150 : 120);
      doc.text(`${project.genre} · ${project.artStyle}`, pageWidth / 2, 85, {
        align: 'center',
      });

      // Cover illustration frame
      const firstPanel = activeStory.panels[0];
      if (firstPanel?.imageUrl) {
        try {
          doc.addImage(
            firstPanel.imageUrl,
            'PNG',
            pageWidth / 2 - 40,
            100,
            80,
            105
          );
        } catch (imgErr) {
          console.warn('Cover image render note:', imgErr);
        }
      }

      doc.setFontSize(10);
      doc.setTextColor(themeMode === 'dark' ? 120 : 160);
      doc.text('Created with ComicCraft AI Studio', pageWidth / 2, pageHeight - 20, {
        align: 'center',
      });

      // Comic Panels Pages (2 panels per page)
      const panels = activeStory.panels;
      for (let i = 0; i < panels.length; i += 2) {
        doc.addPage();

        if (themeMode === 'dark') {
          doc.setFillColor(12, 5, 13);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
        } else {
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
        }

        // Top Panel
        const panel1 = panels[i];
        if (panel1?.imageUrl) {
          try {
            doc.addImage(panel1.imageUrl, 'PNG', 20, 20, pageWidth - 40, 110);
          } catch (e) {
            console.warn(e);
          }
        }

        // Bottom Panel
        const panel2 = panels[i + 1];
        if (panel2?.imageUrl) {
          try {
            doc.addImage(panel2.imageUrl, 'PNG', 20, 145, pageWidth - 40, 110);
          } catch (e) {
            console.warn(e);
          }
        }

        // Footer page number
        doc.setFontSize(9);
        doc.setTextColor(themeMode === 'dark' ? 130 : 150);
        doc.text(
          `${project.title} · Page ${Math.floor(i / 2) + 1}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      doc.save(`${project.title.replace(/\s+/g, '_')}_Comic.pdf`);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadPanelImage = (panel: ComicPanel, index: number) => {
    if (!panel.imageUrl) return;
    const a = document.createElement('a');
    a.href = panel.imageUrl;
    a.download = `${project.title}_Panel_${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#120716] border border-rose-900/70 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-white">
              Export Comic Book
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Summary */}
        <div className="p-3 rounded-lg bg-[#18091d] border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">{project.title}</div>
            <div className="text-[11px] text-zinc-400">
              Chapter: {activeStory.title} ({activeStory.panels.length} Panels)
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950/60 text-rose-300 border border-rose-800">
            {project.genre}
          </span>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Page Format
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as any)}
              className="w-full bg-[#18091d] border border-zinc-800 rounded-lg p-2 text-xs font-semibold text-zinc-200 focus:outline-none"
            >
              <option value="a4">Standard Comic (A4 / 210x297mm)</option>
              <option value="letter">US Comic Standard (Letter)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Gutter / Theme
            </label>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as any)}
              className="w-full bg-[#18091d] border border-zinc-800 rounded-lg p-2 text-xs font-semibold text-zinc-200 focus:outline-none"
            >
              <option value="dark">Cosmic Dark Ink (Modern Studio)</option>
              <option value="classic">Classic White Page (Print)</option>
            </select>
          </div>
        </div>

        {/* PDF Download Section */}
        <div className="rounded-xl bg-gradient-to-br from-rose-950/40 to-[#1e0a22] border border-rose-900/60 p-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Full Multi-Page PDF Edition</span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Generates high-resolution multi-page PDF with cover page, artwork & dialogue lettering.
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-950 shrink-0 transition-all disabled:opacity-50"
          >
            {isExportingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Individual Panels Download */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Download Individual Panels
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeStory.panels.map((panel, idx) => (
              <button
                key={panel.id}
                onClick={() => handleDownloadPanelImage(panel, idx)}
                className="p-2 rounded-lg bg-[#18091d] border border-zinc-800 hover:border-rose-700 text-left transition-all flex items-center justify-between group"
              >
                <span className="text-xs font-bold text-zinc-300 group-hover:text-rose-300">
                  Panel {idx + 1}
                </span>
                <Download className="w-3 h-3 text-zinc-500 group-hover:text-rose-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
