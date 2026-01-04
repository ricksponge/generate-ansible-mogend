
import React, { useEffect } from 'react';

interface TerminalCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  command: string;
}

const TerminalCopyModal: React.FC<TerminalCopyModalProps> = ({ isOpen, onClose, command }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Style Terminal */}
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Console d'exécution SSH — Bash</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors ml-4 text-xl leading-none">×</button>
        </div>

        {/* Terminal Body */}
        <div className="p-8 bg-black/40 font-mono space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-500 font-bold shrink-0">user@m472-forge:~$</span>
              <div className="text-slate-200 text-sm break-all leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10 shadow-inner">
                {command}
                <span className="inline-block w-2 h-4 bg-indigo-500 ml-2 animate-pulse align-middle"></span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl">📋</div>
              <div>
                <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-tight">Commande copiée !</h4>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  Elle a été placée dans votre presse-papier.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[11px] text-slate-300 leading-relaxed flex items-center">
                <span className="text-indigo-400 mr-3 text-lg">💡</span>
                <span>
                  Il ne vous reste plus qu'à ouvrir votre terminal local, vous connecter à la machine de rebond et faire un <strong>clic-droit / coller (ou Ctrl+Shift+V)</strong> pour lancer le playbook.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalCopyModal;
