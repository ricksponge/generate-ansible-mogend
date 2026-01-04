
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

const FRONTEND_LINKS: Record<string, string> = {
  qual: "https://morice-qual.ppsso.gendarmerie.fr",
  preprod: "https://morice-preprod.ppsso.gendarmerie.fr",
  prod: "https://mogend.sso.gendarmerie.fr"
};

interface PhaseButtonProps {
  phase: any;
  isActive: boolean;
  onClick: () => void;
}

const PhaseButton: React.FC<PhaseButtonProps> = ({ phase, isActive, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        className={`w-full p-3 rounded-xl border flex items-center space-x-3 transition-all ${
          isActive 
          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/5' 
          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
        }`}
      >
        <span className="text-xl">{phase.icon}</span>
        <span className="text-[10px] font-bold uppercase text-left leading-tight">{phase.label}</span>
      </button>
      
      {showTooltip && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            {phase.description}
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-700"></div>
        </div>
      )}
    </div>
  );
};

interface TagBadgeProps {
  tag: { id: string, description: string };
  isSelected: boolean;
  onClick: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, isSelected, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-[10px] font-mono border transition-all ${
          isSelected
          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
          : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'
        }`}
      >
        {tag.id}
      </button>
      
      {showTooltip && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-slate-700 rounded shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          <p className="text-[10px] text-slate-300 leading-tight">
            {tag.description}
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [config, setConfig] = useState<CommandConfig>(INITIAL_CONFIG);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
  const [isArchiModalOpen, setIsArchiModalOpen] = useState(false);
  const [isProjectInfoModalOpen, setIsProjectInfoModalOpen] = useState(false);
  const [isUserGuideModalOpen, setIsUserGuideModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isRptModalOpen, setIsRptModalOpen] = useState(false);
  const [isUsefulLinksModalOpen, setIsUsefulLinksModalOpen] = useState(false);

  const updateConfig = (updates: Partial<CommandConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handlePhaseSelect = (phase: string) => {
    let tags: string[] = [];
    if (phase === 'full_pipeline') {
      tags = ['copie', 'bootstrap', 'verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    } else if (phase === 'phase_deployment') {
      tags = ['verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    } else {
      tags = [phase];
    }
    updateConfig({ phase, tags });
  };

  const toggleSpecificTag = (tagId: string) => {
    const newTags = config.tags.includes(tagId) 
      ? config.tags.filter(t => t !== tagId) 
      : [...config.tags, tagId];
    updateConfig({ tags: newTags, phase: 'custom' });
  };

  const handleDownloadRepo = () => {
    window.open(REPO_DOWNLOAD_URL, '_blank');
  };

  const currentFrontendUrl = FRONTEND_LINKS[config.environment] || FRONTEND_LINKS.qual;

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-200">
      <AnsibleConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} />
      <ReadmeModal isOpen={isReadmeModalOpen} onClose={() => setIsReadmeModalOpen(false)} />
      <ArchitectureModal isOpen={isArchiModalOpen} onClose={() => setIsArchiModalOpen(false)} />
      <ProjectInfoModal isOpen={isProjectInfoModalOpen} onClose={() => setIsProjectInfoModalOpen(false)} />
      <UserGuideModal isOpen={isUserGuideModalOpen} onClose={() => setIsUserGuideModalOpen(false)} />
      <MaintenanceScriptsModal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} />
      <TechnicalReportModal isOpen={isRptModalOpen} onClose={() => setIsRptModalOpen(false)} initialEnv={config.environment} />
      <UsefulLinksModal isOpen={isUsefulLinksModalOpen} onClose={() => setIsUsefulLinksModalOpen(false)} />
      
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-white uppercase italic">MOGEND</h1>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Forge M472 / SPWSI</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={() => setIsRptModalOpen(true)} className="flex items-center space-x-2 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest border border-emerald-500/30 transition-all shadow-lg shadow-emerald-500/10">
               <span className="text-sm">📄</span>
               <span>RPT Tech</span>
             </button>
             <button onClick={() => setIsArchiModalOpen(true)} className="flex items-center space-x-2 text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest border border-indigo-500/30 transition-all">
               <span className="text-sm">🏗️</span>
               <span>Architecture</span>
             </button>
             <button onClick={handleDownloadRepo} className="flex items-center space-x-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest border border-slate-700 transition-all">
               <span className="text-sm">📥</span>
               <span>Ansible</span>
             </button>
             <button onClick={() => setIsReadmeModalOpen(true)} className="flex items-center space-x-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest border border-slate-700 transition-all">
               <span className="text-sm">📖</span>
               <span>Doc</span>
             </button>
             <button onClick={() => setIsConfigModalOpen(true)} className="flex items-center space-x-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest border border-slate-700 transition-all">
               <span className="text-sm">⚙️</span>
               <span>Cfg</span>
             </button>
             <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1.5 rounded-lg font-mono border border-slate-700">v3.5</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center text-white">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3 text-sm">01</span>
              Environnement & Cible
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-400">Environnement</label>
                <div className="grid grid-cols-1 gap-2">
                  {ENVIRONMENTS.map(env => (
                    <button key={env.value} onClick={() => updateConfig({ environment: env.value })} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${config.environment === env.value ? `${env.color} border-transparent text-white shadow-lg scale-[1.02]` : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'}`}>
                      <span className="font-bold uppercase tracking-wider">{env.label}</span>
                      {config.environment === env.value && <span className="text-white">✔</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-400">Composant</label>
                <div className="grid grid-cols-1 gap-2">
                  {PROJECTS.map(project => (
                    <button key={project.id} onClick={() => updateConfig({ project: project.id })} className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 ${config.project === project.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                      <span className="text-xl">{project.icon}</span>
                      <span className="font-medium text-sm">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center text-white">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center mr-3 text-sm">02</span>
              Cible des Machines (Limit)
            </h2>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap gap-2">
                {COMMON_GROUPS.map(group => (
                  <button key={group.id} onClick={() => updateConfig({ limit: group.id })} className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${config.limit === group.id ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/20' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-200'}`}>
                    {group.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-mono select-none">--limit</span>
                <input type="text" value={config.limit} onChange={(e) => updateConfig({ limit: e.target.value })} placeholder="Tous (all)" className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-20 pr-4 py-2 text-sm text-amber-400 font-mono focus:ring-1 focus:ring-amber-500 outline-none" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center text-white">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center mr-3 text-sm">03</span>
              Phase de Déploiement
            </h2>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PHASES.map(phase => (
                  <PhaseButton key={phase.value} phase={phase} isActive={config.phase === phase.value} onClick={() => handlePhaseSelect(phase.value)} />
                ))}
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>Tags Spécifiques (Survol pour aide)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIFIC_TAGS.map(tag => (
                    <TagBadge key={tag.id} tag={tag} isSelected={config.tags.includes(tag.id)} onClick={() => toggleSpecificTag(tag.id)} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
             <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center space-x-2 text-slate-500 hover:text-indigo-400 transition-colors mb-4 group">
                <span className={`transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`}>▶</span>
                <span className="text-xs font-bold uppercase tracking-widest">Options Ansible Avancées & Secrets</span>
             </button>

             {showAdvanced && (
               <div className="space-y-8 bg-indigo-950/20 p-8 rounded-3xl border border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <span className="mr-2">🔐</span> Vault Password
                      </label>
                      <input type="password" value={config.vaultPassword} onChange={(e) => updateConfig({ vaultPassword: e.target.value })} placeholder="••••••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-rose-400 font-mono focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <span className="mr-2">👤</span> Remote User (-u)
                      </label>
                      <input type="text" value={config.remoteUser} onChange={(e) => updateConfig({ remoteUser: e.target.value })} placeholder="ex: datafari" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <span className="mr-2">🏁</span> Start at Task
                      </label>
                      <input type="text" value={config.startAtTask} onChange={(e) => updateConfig({ startAtTask: e.target.value })} placeholder="Nom exact de la tâche..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-mono focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <span className="mr-2">➕</span> Extra Vars (-e)
                      </label>
                      <input type="text" value={config.extraVarsRaw} onChange={(e) => updateConfig({ extraVarsRaw: e.target.value })} placeholder="key1=val1 key2=val2" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono focus:ring-1 focus:ring-amber-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Forks (-f)</label>
                      <input type="number" value={config.forks || ''} onChange={(e) => updateConfig({ forks: parseInt(e.target.value) || 0 })} placeholder="0 (Auto)" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SSH Timeout (s)</label>
                      <input type="number" value={config.timeout || ''} onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || 0 })} placeholder="Par défaut (10s)" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-indigo-500/20">
                    {[
                      { label: "Verbose (-vvv)", key: "verbose", color: "bg-indigo-600" },
                      { label: "Dry Run (--check)", key: "checkMode", color: "bg-amber-600" },
                      { label: "Diff (--diff)", key: "diff", color: "bg-emerald-600" },
                      { label: "Step Mode (--step)", key: "step", color: "bg-rose-600" },
                      { label: "Syntax Check", key: "syntaxCheck", color: "bg-slate-600" },
                      { label: "List Tasks", key: "listTasks", color: "bg-slate-600" },
                    ].map((toggle) => (
                      <label key={toggle.key} className="flex items-center space-x-3 cursor-pointer group">
                        <div className={`w-10 h-5 rounded-full transition-all relative ${config[toggle.key as keyof CommandConfig] ? toggle.color : 'bg-slate-700'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${config[toggle.key as keyof CommandConfig] ? 'left-5.5' : 'left-0.5'}`} />
                        </div>
                        <input type="checkbox" className="hidden" checked={!!config[toggle.key as keyof CommandConfig]} onChange={() => updateConfig({ [toggle.key]: !config[toggle.key as keyof CommandConfig] })} />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest">{toggle.label}</span>
                      </label>
                    ))}
                  </div>
               </div>
             )}
          </section>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center text-white">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3 text-sm">04</span>
                Commande Ansible
              </h2>
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className={`w-8 h-4 rounded-full transition-all relative ${config.useMogendHome ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${config.useMogendHome ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                      <input type="checkbox" className="hidden" checked={!!config.useMogendHome} onChange={() => updateConfig({ useMogendHome: !config.useMogendHome })} />
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">Inclure cd "$MOGEND_HOME"</span>
                    </label>
                 </div>
                 <CommandDisplay config={config} />
              </div>

              <div className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Résumé d'Exécution</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 block">Environnement</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-white ${ENVIRONMENTS.find(e => e.value === config.environment)?.color}`}>{config.environment.toUpperCase()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block">Limit Target</span>
                    <span className="text-amber-400 font-mono font-bold uppercase">{config.limit || 'ALL'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block">Vault Mode</span>
                    <span className={`font-bold uppercase font-mono ${config.vaultPassword ? 'text-emerald-400' : 'text-rose-500'}`}>{config.vaultPassword ? 'PROTECTED (PWD)' : 'ASK-PASS'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block">Timeout</span>
                    <span className="text-indigo-400 font-bold">{config.timeout > 0 ? `${config.timeout}s` : 'Défaut'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center text-white">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center mr-3 text-sm">05</span>
                Accès Application
              </h2>
              <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="text-6xl">🌐</span>
                </div>
                <div className="relative z-10 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Frontend MORICE ({config.environment.toUpperCase()})</h3>
                    <p className="text-[10px] text-slate-500 font-mono break-all">{currentFrontendUrl}</p>
                  </div>
                  <a 
                    href={currentFrontendUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    <span>Ouvrir l'application</span>
                    <span className="text-lg">↗</span>
                  </a>
                  <p className="text-[9px] text-slate-600 italic text-center">
                    Note : Nécessite une authentification SSO Certilibre / ProxyMA active.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-800 py-12 bg-slate-950/50">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            <p>© 2025 MOGEND Command Forge — SPWSI / M472</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
               <button onClick={() => setIsUsefulLinksModalOpen(true)} className="flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/30 transition-all font-bold uppercase tracking-widest text-[9px]"><span>🔗</span><span>Liens Utiles</span></button>
               <button onClick={() => setIsRptModalOpen(true)} className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/30 transition-all font-bold uppercase tracking-widest text-[9px]"><span>📄</span><span>RPT Technical</span></button>
               <button onClick={() => setIsMaintenanceModalOpen(true)} className="flex items-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl border border-amber-500/30 transition-all font-bold uppercase tracking-widest text-[9px]"><span>🛠️</span><span>Maintenance</span></button>
               <button onClick={() => setIsUserGuideModalOpen(true)} className="flex items-center space-x-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/30 transition-all font-bold uppercase tracking-widest text-[9px]"><span>📙</span><span>User Guide</span></button>
               <button onClick={() => setIsProjectInfoModalOpen(true)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 transition-all font-bold uppercase tracking-widest text-[9px]"><span>📊</span><span>Project Info</span></button>
            </div>
         </div>
      </footer>
    </div>
  );
}
