
import React, { useState } from 'react';
import { CommandConfig, Action } from './types';
import { PROJECTS, ENVIRONMENTS, PHASES, SPECIFIC_TAGS, COMMON_GROUPS } from './constants';
import CommandDisplay from './components/CommandDisplay';

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
  limit: 'all',
  forks: 0,
  diff: false,
  remoteUser: '',
  become: false,
  startAtTask: '',
  phase: 'phase_precheck'
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

  const removeTag = (type: 'tags' | 'skipTags', index: number) => {
    updateConfig({
      [type]: (config[type] || []).filter((_, i) => i !== index)
    });
  };

  const toggleSpecificTag = (tagId: string) => {
    const newTags = config.tags.includes(tagId) 
      ? config.tags.filter(t => t !== tagId) 
      : [...config.tags, tagId];
    updateConfig({ tags: newTags, phase: 'custom' });
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-200">
      {/* Header */}
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
          <div className="flex items-center space-x-4">
             <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono border border-slate-700">STABLE v3.2</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          
          {/* 01 Target & Env */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center text-white">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3 text-sm">01</span>
                Environnement & Cible
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-400">Environnement</label>
                <div className="grid grid-cols-1 gap-2">
                  {ENVIRONMENTS.map(env => (
                    <button
                      key={env.value}
                      onClick={() => updateConfig({ environment: env.value })}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        config.environment === env.value 
                        ? `${env.color} border-transparent text-white shadow-lg scale-[1.02]` 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
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
                    <button
                      key={project.id}
                      onClick={() => updateConfig({ project: project.id })}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                        config.project === project.id 
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-xl">{project.icon}</span>
                      <span className="font-medium text-sm">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 02 Limit Group */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center text-white">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center mr-3 text-sm">02</span>
              Cible des Machines (Limit)
            </h2>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap gap-2">
                {COMMON_GROUPS.map(group => (
                  <button
                    key={group.id}
                    onClick={() => updateConfig({ limit: group.id })}
                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                      config.limit === group.id 
                      ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/20' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-mono select-none">--limit</span>
                <input 
                  type="text" 
                  value={config.limit} 
                  onChange={(e) => updateConfig({ limit: e.target.value })} 
                  placeholder="Tous (all)" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-20 pr-4 py-2 text-sm text-amber-400 font-mono focus:ring-1 focus:ring-amber-500 outline-none" 
                />
              </div>
            </div>
          </section>

          {/* 03 Phases with Tooltips */}
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
                    onClick={() => handlePhaseSelect(phase.value)}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>Tags Spécifiques (Survol pour aide)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIFIC_TAGS.map(tag => (
                    <TagBadge 
                      key={tag.id} 
                      tag={tag} 
                      isSelected={config.tags.includes(tag.id)} 
                      onClick={() => toggleSpecificTag(tag.id)} 
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 min-h-[40px]">
                 <span className="text-[10px] text-slate-600 w-full mb-1 uppercase tracking-tighter">Tags sélectionnés :</span>
                 {config.tags.length === 0 ? (
                   <span className="text-xs text-slate-700 italic">Aucun tag (exécution totale)</span>
                 ) : (
                   config.tags.map((tag, i) => (
                      <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center">
                        {tag}
                        <button onClick={() => removeTag('tags', i)} className="ml-1.5 hover:text-white transition-colors">×</button>
                      </span>
                   ))
                 )}
              </div>
            </div>
          </section>

          {/* Advanced Section */}
          <section>
             <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-slate-500 hover:text-indigo-400 transition-colors mb-4 group"
             >
                <span className={`transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`}>▶</span>
                <span className="text-xs font-bold uppercase tracking-widest">Options Ansible Avancées</span>
             </button>

             {showAdvanced && (
               <div className="space-y-6 bg-indigo-950/20 p-6 rounded-2xl border border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Remote User (-u)</label>
                      <input type="text" value={config.remoteUser} onChange={(e) => updateConfig({ remoteUser: e.target.value })} placeholder="ex: datafari" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Parallel Forks (-f)</label>
                      <input type="number" value={config.forks} onChange={(e) => updateConfig({ forks: parseInt(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-12 pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className={`w-12 h-6 rounded-full transition-all relative ${config.verbose ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.verbose ? 'left-7' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" className="hidden" checked={config.verbose} onChange={() => updateConfig({ verbose: !config.verbose })} />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Verbose (-vvv)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className={`w-12 h-6 rounded-full transition-all relative ${config.checkMode ? 'bg-amber-600' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.checkMode ? 'left-7' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" className="hidden" checked={config.checkMode} onChange={() => updateConfig({ checkMode: !config.checkMode })} />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Dry Run (--check)</span>
                    </label>
                  </div>
               </div>
             )}
          </section>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center text-white">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mr-3 text-sm">04</span>
              Commande Ansible
            </h2>
            
            <CommandDisplay config={config} />

            <div className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Résumé d'Exécution</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 block">Environnement</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-white ${ENVIRONMENTS.find(e => e.value === config.environment)?.color}`}>
                    {config.environment.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Limit Target</span>
                  <span className="text-amber-400 font-mono font-bold uppercase">{config.limit || 'ALL'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Opération</span>
                  <span className="text-indigo-400 font-bold uppercase">
                    {PHASES.find(p => p.value === config.phase)?.label || 'MANUAL'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Vault</span>
                  <span className="text-rose-500 font-bold uppercase font-mono">--ask-vault-pass</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                 <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex space-x-3 items-start">
                   <span className="text-lg leading-none mt-0.5">⚠️</span>
                   <p className="text-[10px] text-indigo-400 leading-relaxed italic">
                     Cette commande génère l'archive de livraison <code>installation-YYYYMMDD.tar.gz</code> pour le répertoire SPWSI.
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-800 py-12 bg-slate-950/50">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            <p>© 2025 MOGEND Command Forge — SPWSI / M472</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
               <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> System Ready</span>
               <span className="flex items-center font-bold text-slate-400 italic">Plateforme MORICE / Datafari</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
