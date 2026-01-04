
import React, { useState, useEffect } from 'react';

interface LandingScreenProps {
  onEnter: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const [sessionID, setSessionID] = useState('');

  useEffect(() => {
    setSessionID(Math.random().toString(16).substring(2, 10).toUpperCase());
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-mono select-none">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      {/* Top HUD Info */}
      <div className="absolute top-12 left-12 space-y-1 animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">MOGEND_CORE_V3.5</div>
        <div className="text-[8px] text-slate-600 font-mono tracking-tighter uppercase">ENCRYPTED_SESSION: {sessionID}</div>
      </div>

      <div className="absolute top-12 right-12 text-right space-y-1 animate-in fade-in slide-in-from-right-8 duration-1000">
        <div className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">CLUSTER_STATUS</div>
        <div className="flex space-x-1.5 justify-end mt-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-4 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center space-y-12">
        {/* Glow Effect */}
        <div className="absolute inset-0 -m-32 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
        
        <div className="relative group cursor-default">
          <h1 className="text-8xl md:text-[11rem] font-black italic text-[#10b981] tracking-tighter leading-none animate-in zoom-in-95 duration-1000 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all group-hover:drop-shadow-[0_0_60px_rgba(16,185,129,0.7)]">
            MOGEND
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
        </div>

        <div className="flex flex-col items-center space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
          <div className="text-center space-y-2">
            <p className="text-sm md:text-base text-slate-100 font-black uppercase tracking-[0.8em] italic">Industrialized Search Engine</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-mono">High-Performance Indexing // Forge M472 Enforced</p>
          </div>

          <button 
            onClick={onEnter}
            className="px-12 py-4 bg-[#10b981] hover:bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_45px_rgba(16,185,129,0.5)] active:scale-95 group overflow-hidden relative"
          >
            <span className="relative z-10 italic">Accéder au Terminal</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>

      {/* Decoration lines */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
         <div className="w-px h-24 bg-gradient-to-t from-emerald-500 to-transparent"></div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline {
          width: 100%;
          height: 100px;
          background: linear-gradient(0deg, transparent, rgba(16, 185, 129, 0.05), transparent);
          position: absolute;
          top: 0;
          left: 0;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
      `}</style>
      <div className="scanline"></div>
    </div>
  );
};

export default LandingScreen;
