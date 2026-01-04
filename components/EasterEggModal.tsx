
import React, { useEffect, useState } from 'react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timers = [
        setTimeout(() => setStep(1), 800),   // System Boot
        setTimeout(() => setStep(2), 2500),  // ManifoldCF: Crawling Data
        setTimeout(() => setStep(3), 5000),  // SolrCloud: Indexing & Sharding
        setTimeout(() => setStep(4), 7500),  // MOGEND: Core Ready
        setTimeout(() => setStep(5), 9000),  // Final Interface
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950 overflow-hidden font-mono select-none">
      {/* Background Matrix/Data Layer */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-10">
        
        {/* PROGRESS HUD (Always visible after boot) */}
        {step >= 1 && (
          <div className="absolute top-10 left-10 right-10 flex justify-between items-start animate-in fade-in duration-1000">
            <div className="space-y-1">
              <div className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">MOGEND_CORE_V3.5</div>
              <div className="text-[8px] text-slate-500 font-mono">ENCRYPTED_SESSION: {Math.random().toString(16).substring(2, 10).toUpperCase()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">CLUSTER_STATUS</div>
              <div className="flex space-x-1 mt-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-3 h-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-800'}`}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          
          {/* STEP 1: INITIALIZATION */}
          {step === 1 && (
            <div className="space-y-6 text-center animate-in zoom-in-95 fade-in duration-700">
              <div className="text-emerald-500 text-4xl animate-pulse">⚡</div>
              <div className="space-y-2">
                <div className="text-slate-200 text-lg font-bold tracking-tighter uppercase italic">Initializing Search Fabric...</div>
                <div className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Checking Zookeeper Quorum... OK <br/>
                  Locating SolrCloud Nodes... OK <br/>
                  Mounting ManifoldCF Repositories... OK
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MANIFOLDCF CRAWL */}
          {step === 2 && (
            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
              <div className="text-center space-y-2">
                <div className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">Phase 01: Ingestion</div>
                <h3 className="text-2xl font-black text-white italic uppercase">ManifoldCF Connector</h3>
              </div>
              
              <div className="relative h-24 border border-indigo-500/20 rounded-2xl bg-indigo-500/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-around">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} 
                         className="w-1 bg-indigo-500/40 rounded-full animate-crawling"
                         style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.1}s` }}>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 text-[10px] font-bold text-indigo-300 bg-slate-950/80 px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                  Crawling Data Streams...
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SOLRCLOUD INDEXING */}
          {step === 3 && (
            <div className="w-full max-w-xl space-y-10 animate-in zoom-in-105 fade-in duration-700">
              <div className="text-center space-y-2">
                <div className="text-amber-400 text-xs font-black uppercase tracking-[0.3em]">Phase 02: Sharding</div>
                <h3 className="text-2xl font-black text-white italic uppercase">SolrCloud Crystalization</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 h-32">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-500/10 translate-y-full animate-indexing" style={{ animationDelay: `${i * 0.4}s` }}></div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase relative z-10 tracking-widest">Shard_{i}</span>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative z-10">
                      <div className="h-full bg-amber-500 w-full -translate-x-full animate-sharding" style={{ animationDelay: `${i * 0.3}s` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 & 5: FINAL IGNITION */}
          {(step === 4 || step === 5) && (
            <div className="relative flex flex-col items-center space-y-10">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 -m-20 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
              
              <div className="relative">
                <h1 className="text-8xl md:text-[12rem] font-black italic text-emerald-500 tracking-tighter leading-none animate-in zoom-in-75 duration-1000 drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                  MOGEND
                </h1>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-in slide-in-from-left-full duration-[2s]"></div>
              </div>

              {step === 5 && (
                <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000">
                  <div className="text-center space-y-1">
                    <p className="text-sm text-slate-200 font-bold uppercase tracking-[0.8em]">Industrialized Search Engine</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">High-Performance Indexing // Forge M472 Enforced</p>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={onClose}
                      className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group overflow-hidden relative"
                    >
                      <span className="relative z-10">Accéder au Terminal</span>
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* FOOTER INFO */}
      {step >= 1 && (
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end animate-in fade-in duration-1000 delay-500">
          <div className="space-y-1">
             <div className="text-[9px] text-slate-600 font-mono">NODES: ONLINE</div>
             <div className="text-[9px] text-slate-600 font-mono">REPLICATION: ENABLED (T3_STRATEGY)</div>
          </div>
          <div className="text-right">
             <div className="text-[9px] text-slate-700 font-mono italic">"Searching through the noise, finding the truth."</div>
          </div>
        </div>
      )}

      {/* ANIMATION STYLES */}
      <style>{`
        @keyframes crawling {
          0%, 100% { height: 20%; transform: translateY(0); opacity: 0.3; }
          50% { height: 80%; transform: translateY(-5px); opacity: 1; }
        }
        .animate-crawling {
          animation: crawling 1s ease-in-out infinite;
        }
        @keyframes indexing {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .animate-indexing {
          animation: indexing 2s linear infinite;
        }
        @keyframes sharding {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-sharding {
          animation: sharding 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EasterEggModal;
