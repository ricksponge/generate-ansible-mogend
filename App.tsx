
import React, { useState } from 'react';
import { CommandConfig, Action } from './types';
import { PROJECTS, ENVIRONMENTS, PHASES, SPECIFIC_TAGS, COMMON_GROUPS } from './constants';
import CommandDisplay from './components/CommandDisplay';
import AnsibleConfigModal from './components/AnsibleConfigModal';
import ReadmeModal from './components/ReadmeModal';
import ArchitectureModal from './components/ArchitectureModal';
import ProjectInfoModal from './components/ProjectInfoModal';
import UserGuideModal from './components/UserGuideModal';
import MaintenanceScriptsModal from './components/MaintenanceScriptsModal';
import TechnicalReportModal from './components/TechnicalReportModal';
import UsefulLinksModal from './components/UsefulLinksModal';
import EasterEggModal from './components/EasterEggModal';
import LandingScreen from './components/LandingScreen';

const INITIAL_CONFIG: CommandConfig = {
  project: PROJECTS[0].id,
  environment: 'qual',
  action: Action.DEPLOY,
  version: 'main',
  verbose: false,
  checkMode: false,
  tags: ['phase_precheck'],
  skipTags: [],
  extraVars: {},
  extraVarsRaw: '',
  limit: 'all',
  forks: 0,
  diff: false,
  remoteUser: '',
  become: false,
  startAtTask: '',
  step: false,
  syntaxCheck: false,
  listTasks: false,
  listTags: false,
  timeout: 0,
  vaultPassword: '',
  phase: 'phase_precheck',
  useMogendHome: true
};

const REPO_DOWNLOAD_URL = "https://omnibus-pic.gendarmerie.fr/spwsi/morice2/deploiement/-/archive/dev_lommere/deploiement-dev_lommere.tar.gz";
const BINARY_DOWNLOAD_URL = "https://nextcloud.francelabs.com/s/5Zw9JHriqoXeZLn";

const FRONTEND_LINKS: Record<string, string> = {
  qual: "https://morice-qual.ppsso.gendarmerie.fr",
  preprod: "https://morice-preprod.ppsso.gendarmerie.fr",
  prod: "https://mogend.sso.gendarmerie.fr"
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [config, setConfig] = useState<CommandConfig>(INITIAL_CONFIG);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hoverDetail, setHoverDetail] = useState<{title: string, desc: string, icon: string} | null>(null);

  // Modales
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
  const [isArchiModalOpen, setIsArchiModalOpen] = useState(false);
  const [isProjectInfoModalOpen, setIsProjectInfoModalOpen] = useState(false);
  const [isUserGuideModalOpen, setIsUserGuideModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isRptModalOpen, setIsRptModalOpen] = useState(false);
  const [isUsefulLinksModalOpen, setIsUsefulLinksModalOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  const updateConfig = (updates: Partial<CommandConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    setShowAdvanced(false);
  };

  const handlePhaseApply = (phase: string) => {
    let tags: string[] = [];
    if (phase === 'full_pipeline') {
      tags = ['copie', 'bootstrap', 'verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    } else if (phase === 'phase_deployment') {
      tags = ['verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    } else if (phase === 'custom_tags') {
      tags = []; 
    } else {
      tags = [phase];
    }
    updateConfig({ phase, tags });
  };

  const toggleSpecificTag = (tagId: string) => {
    const newTags = config.tags.includes(tagId) 
      ? config.tags.filter(t => t !== tagId) 
      : [...config.tags, tagId];
    
    const newPhase = (config.phase === 'full_pipeline' || config.phase === 'phase_deployment' || config.phase === 'custom_tags') 
      ? config.phase 
      : 'custom_tags';

    updateConfig({ tags: newTags, phase: newPhase });
  };

  const handleLimitToggle = (groupId: string) => {
    const currentLimits = config.limit ? config.limit.split(',').map(l => l.trim()) : [];
    let newLimits: string[] = [];

    if (groupId === 'all') {
      newLimits = ['all'];
    } else {
      const filtered = currentLimits.filter(l => l !== 'all' && l !== '');
      if (filtered.includes(groupId)) {
        newLimits = filtered.filter(l => l !== groupId);
      } else {
        newLimits = [...filtered, groupId];
      }
      if (newLimits.length === 0) newLimits = ['all'];
    }
    updateConfig({ limit: newLimits.join(',') });
  };

  const isLimitSelected = (groupId: string) => {
    const currentLimits = config.limit ? config.limit.split(',').map(l => l.trim()) : [];
    return currentLimits.includes(groupId);
  };

  const currentFrontendUrl = FRONTEND_LINKS[config.environment] || FRONTEND_LINKS.qual;

  // Classe CSS commune pour les boutons Action Card
  const actionButtonClass = "flex items-center space-x-3 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all group shrink-0 shadow-sm hover:shadow-indigo-500/10 active:scale-95";

  if (!hasEntered) {
    return <LandingScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen pb-40 bg-[#020617] text-slate-200 selection:bg-indigo-500/30 animate-in fade-in duration-1000">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .logo-animate { animation: breathe 4s ease-in-out infinite; }
        .shimmer-effect::after {
          content: ""; position: absolute; top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 3s infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Modales */}
      <AnsibleConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} />
      <ReadmeModal isOpen={isReadmeModalOpen} onClose={() => setIsReadmeModalOpen(false)} />
      <ArchitectureModal isOpen={isArchiModalOpen} onClose={() => setIsArchiModalOpen(false)} />
      <ProjectInfoModal isOpen={isProjectInfoModalOpen} onClose={() => setIsProjectInfoModalOpen(false)} />
      <UserGuideModal isOpen={isUserGuideModalOpen} onClose={() => setIsUserGuideModalOpen(false)} />
      <MaintenanceScriptsModal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} />
      <TechnicalReportModal isOpen={isRptModalOpen} onClose={() => setIsRptModalOpen(false)} initialEnv={config.environment} />
      <UsefulLinksModal isOpen={isUsefulLinksModalOpen} onClose={() => setIsUsefulLinksModalOpen(false)} />
      <EasterEggModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />

      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsEasterEggOpen(true)}
              className="logo-animate shimmer-effect relative w-12 h-12 bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all overflow-hidden border border-white/10"
            >
              <span className="text-white font-black text-2xl relative z-10 italic">M</span>
            </button>
            <div>
              <h1 className="font-black text-xl leading-none tracking-tight text-white uppercase italic">MOGEND</h1>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Forge M472 / SPWSI</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-2">
             <button onClick={() => setIsRptModalOpen(true)} className={actionButtonClass}>
               <span className="text-2xl group-hover:scale-110 transition-transform">📄</span>
               <div className="text-left">
                 <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">RPT Technique</div>
                 <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Export STIG</div>
               </div>
             </button>

             <button onClick={() => setIsArchiModalOpen(true)} className={actionButtonClass}>
               <span className="text-2xl group-hover:scale-110 transition-transform">🏗️</span>
               <div className="text-left">
                 <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Architecture</div>
                 <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Flux & Infra</div>
               </div>
             </button>

             <button onClick={() => window.open(BINARY_DOWNLOAD_URL, '_blank')} className={actionButtonClass}>
               <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
               <div className="text-left">
                 <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Binaire Datafari</div>
                 <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Paquet .deb / v6</div>
               </div>
             </button>

             <button onClick={() => window.open(REPO_DOWNLOAD_URL, '_blank')} className={actionButtonClass}>
               <span className="text-2xl group-hover:scale-110 transition-transform">📥</span>
               <div className="text-left">
                 <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Ansible Src</div>
                 <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Archive .tar.gz</div>
               </div>
             </button>

             <div className="w-px h-10 bg-slate-800/50 mx-2 shrink-0"></div>
             <span className="text-[11px] bg-slate-800/50 text-slate-400 px-4 py-3 rounded-2xl font-mono border border-slate-800 italic shrink-0">v3.5</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-12">
          
          {/* 01 Environnement */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center text-white italic">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3 text-sm">01</span>
                Environnement
              </h2>
              <button onClick={handleReset} className="text-[10px] font-bold uppercase text-slate-500 hover:text-rose-400 transition-all px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">🔄 Reset</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ENVIRONMENTS.map(env => (
                <button key={env.value} onClick={() => updateConfig({ environment: env.value })} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${config.environment === env.value ? `${env.color} border-transparent text-white shadow-lg scale-[1.02]` : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'}`}>
                  <span className="font-bold uppercase tracking-wider">{env.label}</span>
                  {config.environment === env.value && <span>✔</span>}
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <span className="text-emerald-500">🌐</span>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Lien Frontend direct</div>
                  <div className="text-xs font-mono text-slate-300 group-hover:text-emerald-400 transition-colors">{currentFrontendUrl}</div>
                </div>
              </div>
              <a href={currentFrontendUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-400 rounded-lg border border-slate-700 transition-all shadow-sm">Ouvrir le site</a>
            </div>
          </section>

          {/* 02 Limit */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center text-white italic">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center mr-3 text-sm">02</span>
              Cible (Limit)
            </h2>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {COMMON_GROUPS.map(group => (
                  <button 
                    key={group.id} 
                    onClick={() => handleLimitToggle(group.id)} 
                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${isLimitSelected(group.id) ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/20' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-200'}`}
                  >
                    {group.label} {isLimitSelected(group.id) && group.id !== 'all' && <span className="ml-1 opacity-50">×</span>}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-[10px] font-mono select-none uppercase tracking-widest">--limit</span>
                <input type="text" value={config.limit} onChange={(e) => updateConfig({ limit: e.target.value })} placeholder="all, solr, mcf1..." className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-20 pr-4 py-2 text-sm text-amber-400 font-mono focus:ring-1 focus:ring-amber-500 outline-none" />
              </div>
            </div>
          </section>

          {/* 03 Phases & Tags */}
          <section className="relative">
            <h2 className="text-xl font-bold mb-4 flex items-center text-white italic">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center mr-3 text-sm">03</span>
              Phase & Tags
            </h2>

            <div className="h-20 mb-4 transition-all duration-300">
               {hoverDetail ? (
                 <div className="h-full p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
                   <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">{hoverDetail.icon}</span>
                   <div>
                     <h4 className="text-[10px] font-black text-indigo-400 uppercase italic tracking-widest mb-1">{hoverDetail.title}</h4>
                     <p className="text-[11px] text-slate-400 leading-tight italic">{hoverDetail.desc}</p>
                   </div>
                 </div>
               ) : (
                 <div className="h-full flex items-center justify-center border border-dashed border-slate-800 rounded-xl opacity-30">
                   <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Survolez un élément pour analyser</p>
                 </div>
               )}
            </div>

            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-8 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PHASES.map(phase => (
                  <button 
                    key={phase.value} 
                    onMouseEnter={() => setHoverDetail({ title: phase.label, desc: phase.description, icon: phase.icon })}
                    onMouseLeave={() => setHoverDetail(null)}
                    onClick={() => handlePhaseApply(phase.value)} 
                    className={`w-full p-4 rounded-xl border flex items-center space-x-3 transition-all relative group ${config.phase === phase.value ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 shadow-lg' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'}`}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{phase.icon}</span>
                    <span className="text-[10px] font-bold uppercase text-left leading-tight">{phase.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center space-x-3">
                  <span>Sélecteur de Tags précis</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIFIC_TAGS.map(tag => (
                    <button 
                      key={tag.id} 
                      onMouseEnter={() => setHoverDetail({ title: tag.id, desc: tag.description, icon: '🏷️' })}
                      onMouseLeave={() => setHoverDetail(null)}
                      onClick={() => toggleSpecificTag(tag.id)} 
                      className={`px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all hover:scale-105 active:scale-95 ${config.tags.includes(tag.id) ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-200'}`}
                    >
                      {tag.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 04 Paramètres Avancés RESTAURÉS */}
          <section className="relative">
            <h2 className="text-xl font-bold mb-6 flex items-center text-white italic">
              <span className="w-8 h-8 rounded-lg bg-slate-500/20 text-slate-400 flex items-center justify-center mr-3 text-sm">04</span>
              Paramètres Avancés
            </h2>
            
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className="w-full flex items-center justify-between p-5 bg-slate-900/60 rounded-2xl border border-slate-800 hover:bg-slate-900 transition-all text-slate-400 hover:text-white shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">⚙️</span>
                <div className="text-left">
                  <span className="text-xs font-black uppercase tracking-widest block">Configuration Expert</span>
                  <span className="text-[9px] text-slate-600 uppercase font-mono italic tracking-tighter">Vault, Forks, Become, Syntax Check...</span>
                </div>
              </div>
              <span className={`transform transition-transform duration-500 text-xs font-mono text-slate-700 ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {showAdvanced && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                {/* Bloc 1: Exécution & Modes */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Exécution & Modes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500/30 transition-all">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Mode Check</span>
                      <input type="checkbox" checked={config.checkMode} onChange={() => updateConfig({ checkMode: !config.checkMode })} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500/30 transition-all">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Mode Diff</span>
                      <input type="checkbox" checked={config.diff} onChange={() => updateConfig({ diff: !config.diff })} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer text-slate-500 hover:text-slate-300">
                      <span className="text-[8px] font-black uppercase">Syntax Check</span>
                      <input type="checkbox" checked={config.syntaxCheck} onChange={() => updateConfig({ syntaxCheck: !config.syntaxCheck })} className="w-4 h-4" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer text-slate-500 hover:text-slate-300">
                      <span className="text-[8px] font-black uppercase">Pas à Pas</span>
                      <input type="checkbox" checked={config.step} onChange={() => updateConfig({ step: !config.step })} className="w-4 h-4" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer text-slate-500 hover:text-slate-300">
                      <span className="text-[8px] font-black uppercase">Lister Tâches</span>
                      <input type="checkbox" checked={config.listTasks} onChange={() => updateConfig({ listTasks: !config.listTasks })} className="w-4 h-4" />
                    </label>
                    <label className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer text-slate-500 hover:text-slate-300">
                      <span className="text-[8px] font-black uppercase">Lister Tags</span>
                      <input type="checkbox" checked={config.listTags} onChange={() => updateConfig({ listTags: !config.listTags })} className="w-4 h-4" />
                    </label>
                  </div>
                  <label className="flex items-center justify-between p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/10">
                    <span className="text-[10px] font-black text-indigo-400 uppercase">Devenir Root (--become)</span>
                    <input type="checkbox" checked={config.become} onChange={() => updateConfig({ become: !config.become })} className="w-5 h-5" />
                  </label>
                </div>

                {/* Bloc 2: Connexion & Performance */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
                  <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Connexion & Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Utilisateur Distant</label>
                      <input type="text" value={config.remoteUser} onChange={(e) => updateConfig({ remoteUser: e.target.value })} placeholder="Ex: root" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Parallélisme (-f)</label>
                      <input type="number" value={config.forks || ''} onChange={(e) => updateConfig({ forks: parseInt(e.target.value) || 0 })} placeholder="Défaut (5)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Timeout SSH (s)</label>
                    <input type="number" value={config.timeout || ''} onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || 0 })} placeholder="0 (No timeout)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono" />
                  </div>
                  <label className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer">
                    <span className="text-[10px] font-black text-slate-400 uppercase italic">Verbosité (-vvv)</span>
                    <input type="checkbox" checked={config.verbose} onChange={() => updateConfig({ verbose: !config.verbose })} className="w-5 h-5" />
                  </label>
                </div>

                {/* Bloc 3: Variables & Reprise */}
                <div className="md:col-span-2 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
                  <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Secrets & Reprise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Mot de passe Vault</label>
                      <input type="password" value={config.vaultPassword} onChange={(e) => updateConfig({ vaultPassword: e.target.value })} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Extra Vars (-e)</label>
                      <input type="text" value={config.extraVarsRaw} onChange={(e) => updateConfig({ extraVarsRaw: e.target.value })} placeholder="Ex: force=yes" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-500 font-mono" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Reprendre à la tâche</label>
                      <input type="text" value={config.startAtTask} onChange={(e) => updateConfig({ startAtTask: e.target.value })} placeholder="Ex: restart tomcat" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center text-white italic">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3 text-sm">05</span>
                Génération Forge
              </h2>
              <div className="space-y-6">
                 <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-4 rounded-full relative cursor-pointer ${config.useMogendHome ? 'bg-indigo-600' : 'bg-slate-700'}`} onClick={() => updateConfig({ useMogendHome: !config.useMogendHome })}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${config.useMogendHome ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Chemin $MOGEND_HOME</span>
                    </div>
                 </div>
                 <CommandDisplay config={config} />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Dock de Navigation Inférieur - Homogénéisé */}
      <footer className="fixed bottom-0 left-0 right-0 z-[60] bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800/50 px-6 py-6 flex justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-4 max-w-6xl w-full overflow-x-auto no-scrollbar pb-2 justify-center">
          
          <button onClick={() => setIsProjectInfoModalOpen(true)} className={actionButtonClass}>
            <span className="text-2xl group-hover:scale-110 transition-transform">🔎</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Projet MORICE</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Infra & Stack</div>
            </div>
          </button>

          <button onClick={() => setIsUserGuideModalOpen(true)} className={actionButtonClass}>
            <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Guide Expert</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Quick Start Guide</div>
            </div>
          </button>

          <button onClick={() => setIsMaintenanceModalOpen(true)} className={actionButtonClass}>
            <span className="text-2xl group-hover:scale-110 transition-transform">🛠️</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Maintenance</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Utilitaires & Scripts</div>
            </div>
          </button>

          <button onClick={() => setIsUsefulLinksModalOpen(true)} className={actionButtonClass}>
            <span className="text-2xl group-hover:scale-110 transition-transform">🔗</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Ecosystème</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Jira, Confluence...</div>
            </div>
          </button>

          <button onClick={() => setIsReadmeModalOpen(true)} className={actionButtonClass}>
            <span className="text-2xl group-hover:scale-110 transition-transform">📖</span>
            <div className="text-left">
              <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">Documentation</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Manuel M472</div>
            </div>
          </button>

          <div className="w-px h-10 bg-slate-800/50 mx-2 shrink-0"></div>

          <button onClick={() => setIsConfigModalOpen(true)} className="px-6 py-4 bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700 rounded-3xl transition-all flex items-center justify-center shrink-0 shadow-lg active:scale-90 group">
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-500">⚙️</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
