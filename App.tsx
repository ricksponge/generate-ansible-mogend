
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

/**
 * Composant Modal Informatif / Confirmation
 */
const HelpModal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  description: string, 
  icon?: string,
  onConfirm?: () => void,
  confirmLabel?: string
}> = ({ isOpen, onClose, title, description, icon = "ℹ️", onConfirm, confirmLabel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-3xl border border-indigo-500/20 mx-auto mb-6 shadow-inner">
            {icon}
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight italic mb-4">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-8">
            {description}
          </p>
          
          <div className="space-y-3">
            {onConfirm && (
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                {confirmLabel || "Confirmer la sélection"}
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-colors border border-slate-700"
            >
              {onConfirm ? "Annuler" : "J'ai compris"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PhaseButtonProps {
  phase: any;
  isActive: boolean;
  onClick: () => void;
}

const PhaseButton: React.FC<PhaseButtonProps> = ({ phase, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border flex items-center space-x-3 transition-all relative group ${
        isActive 
        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/5' 
        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{phase.icon}</span>
      <span className="text-[10px] font-bold uppercase text-left leading-tight">{phase.label}</span>
    </button>
  );
};

interface TagBadgeProps {
  tag: { id: string, description: string };
  isSelected: boolean;
  onClick: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[10px] font-mono border transition-all hover:scale-105 active:scale-95 ${
        isSelected
        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
        : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'
      }`}
    >
      {tag.id}
    </button>
  );
};

export default function App() {
  const [config, setConfig] = useState<CommandConfig>(INITIAL_CONFIG);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Modale d'aide contextuelle
  const [helpData, setHelpData] = useState<{title: string, desc: string, icon?: string, onConfirm?: () => void, label?: string} | null>(null);

  // Modales principales
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

  const handlePhaseApply = (phase: string) => {
    let tags: string[] = [];
    if (phase === 'full_pipeline') {
      // Tags exacts du script run.sh Case 7
      tags = ['copie', 'bootstrap', 'verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    } else if (phase === 'phase_deployment') {
      // Tags exacts du script run.sh Case 9
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
    // On repasse en mode "custom" pour autoriser la surbrillance visuelle
    updateConfig({ tags: newTags, phase: 'custom' });
  };

  const currentFrontendUrl = FRONTEND_LINKS[config.environment] || FRONTEND_LINKS.qual;

  const OptionHelpTrigger: React.FC<{ title: string, desc: string, icon?: string }> = ({ title, desc, icon }) => (
    <button 
      onClick={() => setHelpData({ title, desc, icon })}
      className="ml-2 w-4 h-4 rounded-full bg-slate-800 text-slate-500 hover:bg-indigo-500 hover:text-white flex items-center justify-center text-[8px] font-bold border border-slate-700 transition-all active:scale-90"
      title="Plus d'informations"
    >
      ?
    </button>
  );

  // Détermine si on doit afficher la surbrillance visuelle des tags spécifiques
  const isGlobalPhase = config.phase === 'full_pipeline' || config.phase === 'phase_deployment';

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
      
      {/* Help Context Modal */}
      <HelpModal 
        isOpen={!!helpData} 
        onClose={() => setHelpData(null)} 
        title={helpData?.title || ""} 
        description={helpData?.desc || ""} 
        icon={helpData?.icon}
        onConfirm={helpData?.onConfirm}
        confirmLabel={helpData?.label}
      />

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
             <button onClick={() => window.open(REPO_DOWNLOAD_URL, '_blank')} className="flex items-center space-x-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest border border-slate-700 transition-all">
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
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center">
                  <span>Composant</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PROJECTS.map(project => (
                    <button 
                      key={project.id}
                      onClick={() => {
                        updateConfig({ project: project.id });
                        setHelpData({ title: project.name, desc: project.description, icon: project.icon });
                      }} 
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center space-x-3 group ${config.project === project.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">{project.icon}</span>
                      <span className="font-bold text-sm">{project.name}</span>
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
                  <PhaseButton 
                    key={phase.value} 
                    phase={phase} 
                    isActive={config.phase === phase.value} 
                    onClick={() => {
                      setHelpData({ 
                        title: phase.label, 
                        desc: phase.description, 
                        icon: phase.icon,
                        label: "Sélectionner cette phase",
                        onConfirm: () => handlePhaseApply(phase.value)
                      });
                    }}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex justify-between items-center">
                  <span>Tags Spécifiques</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIFIC_TAGS.map(tag => (
                    <TagBadge 
                      key={tag.id} 
                      tag={tag} 
                      // FIX: On n'affiche la sélection visuelle QUE si on n'est pas dans une phase globale
                      isSelected={!isGlobalPhase && config.tags.includes(tag.id)} 
                      onClick={() => {
                        toggleSpecificTag(tag.id);
                        setHelpData({ title: tag.id, desc: tag.description, icon: "🏷️" });
                      }} 
                    />
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
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <span className="mr-2">🔐</span> Vault Password
                        </span>
                        <OptionHelpTrigger title="Vault Password" desc="Mot de passe chiffré permettant de déverrouiller les variables sensibles stockées dans group_vars/all.yml." icon="🔐" />
                      </div>
                      <input type="password" value={config.vaultPassword} onChange={(e) => updateConfig({ vaultPassword: e.target.value })} placeholder="••••••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-rose-400 font-mono focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <span className="mr-2">👤</span> Remote User (-u)
                        </span>
                        <OptionHelpTrigger title="Remote User" desc="L'utilisateur SSH utilisé pour se connecter aux machines distantes (ex: debian, root, datafari)." icon="👤" />
                      </div>
                      <input type="text" value={config.remoteUser} onChange={(e) => updateConfig({ remoteUser: e.target.value })} placeholder="ex: datafari" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <span className="mr-2">🏁</span> Start at Task
                        </span>
                        <OptionHelpTrigger title="Start at Task" desc="Reprend l'exécution du playbook à partir du nom exact d'une tâche (utile après une erreur corrigée)." icon="🏁" />
                      </div>
                      <input type="text" value={config.startAtTask} onChange={(e) => updateConfig({ startAtTask: e.target.value })} placeholder="Nom exact de la tâche..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-mono focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <span className="mr-2">➕</span> Extra Vars (-e)
                        </span>
                        <OptionHelpTrigger title="Extra Vars" desc="Injection de variables supplémentaires à la volée au format clé=valeur (ex: version=1.2.3)." icon="➕" />
                      </div>
                      <input type="text" value={config.extraVarsRaw} onChange={(e) => updateConfig({ extraVarsRaw: e.target.value })} placeholder="key1=val1 key2=val2" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono focus:ring-1 focus:ring-amber-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-indigo-500/20">
                    {[
                      { label: "Verbose (-vvv)", key: "verbose", color: "bg-indigo-600", help: "Affiche le détail complet des logs Ansible (Debug)." },
                      { label: "Dry Run (--check)", key: "checkMode", color: "bg-amber-600", help: "Simule l'exécution sans appliquer de changements réels." },
                      { label: "Diff (--diff)", key: "diff", color: "bg-emerald-600", help: "Affiche les différences exactes dans les fichiers de configuration." },
                      { label: "Step Mode (--step)", key: "step", color: "bg-rose-600", help: "Demande une confirmation manuelle avant chaque tâche." },
                      { label: "Syntax Check", key: "syntaxCheck", color: "bg-slate-600", help: "Vérifie la syntaxe YAML sans contacter les serveurs." },
                      { label: "List Tasks", key: "listTasks", color: "bg-slate-600", help: "Affiche simplement la liste des tâches ordonnées." },
                    ].map((toggle) => (
                      <div key={toggle.key} className="flex flex-col space-y-1">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <div className={`w-10 h-5 rounded-full transition-all relative ${config[toggle.key as keyof CommandConfig] ? toggle.color : 'bg-slate-700'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${config[toggle.key as keyof CommandConfig] ? 'left-5.5' : 'left-0.5'}`} />
                          </div>
                          <input type="checkbox" className="hidden" checked={!!config[toggle.key as keyof CommandConfig]} onChange={() => updateConfig({ [toggle.key]: !config[toggle.key as keyof CommandConfig] })} />
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest flex items-center">
                            {toggle.label}
                          </span>
                        </label>
                        <button 
                          onClick={() => setHelpData({ title: toggle.label, desc: toggle.help, icon: "⚙️" })}
                          className="text-[8px] text-slate-600 hover:text-indigo-400 transition-colors uppercase text-left w-fit border-b border-dotted border-slate-800"
                        >
                          Détails
                        </button>
                      </div>
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
