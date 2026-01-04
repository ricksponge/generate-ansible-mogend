
import React, { useEffect } from 'react';
import { CommandConfig } from '../types';
import { SPECIFIC_TAGS, ENVIRONMENTS } from '../constants';

interface CommandExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CommandConfig;
}

const CommandExplanationModal: React.FC<CommandExplanationModalProps> = ({ isOpen, onClose, config }) => {
  // Désactiver le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEnv = ENVIRONMENTS.find(e => e.value === config.environment);
  
  // Mapping strict basé sur les tags réellement présents dans la config
  const selectedTagsInfo = config.tags.map(tagId => {
    const found = SPECIFIC_TAGS.find(t => t.id === tagId);
    return found || { id: tagId, description: "Tag système ou personnalisé sans description enregistrée." };
  });

  // Catégorisation pour le pipeline visuel
  const categories = {
    prep: selectedTagsInfo.filter(t => ['copie', 'bootstrap', 'verif', 'ssh', 'finger', 'java_env'].includes(t.id)),
    core: selectedTagsInfo.filter(t => t.id.startsWith('phase_') || ['solr', 'mcf', 'lancement'].includes(t.id)),
    sec: selectedTagsInfo.filter(t => ['nftables', 'replace_certs', 'verif_certilibre'].includes(t.id)),
    post: selectedTagsInfo.filter(t => ['logs', 'fetch_log', 'monitor_script', 'phase_post'].includes(t.id))
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* FIXED HEADER */}
        <div className="shrink-0 px-6 sm:px-8 py-4 sm:py-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner">🧠</div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">Intelligence d'Exécution</h2>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-widest">Analyse contextuelle M472</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-3xl p-2 hover:bg-slate-800 rounded-full transition-all leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar bg-slate-950/30">
          
          {/* SYNTHÈSE RAPIDE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl">
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 sm:mb-2">Environnement</span>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${currentEnv?.color}`}></span>
                <span className="text-white font-bold text-xs sm:text-sm">{currentEnv?.label}</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl border-l-amber-500/50">
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 sm:mb-2">Target Limit (Machines)</span>
              <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm tracking-tight truncate">{config.limit || 'all'}</span>
            </div>
          </div>

          {/* DÉTAIL DES TAGS (PIPELINE) */}
          <div className="space-y-4">
            <h3 className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center">
              <span className="mr-2">⛓️</span> Séquence de déploiement (Tags actifs)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                {categories.prep.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase pl-1">1. Initialisation</span>
                    {categories.prep.map(t => (
                      <div key={t.id} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl group hover:border-indigo-500/30 transition-colors">
                        <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 font-mono">--tags {t.id}</span>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 italic leading-tight">{t.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                {categories.core.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-500 uppercase pl-1">2. Core Application</span>
                    {categories.core.map(t => (
                      <div key={t.id} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl group hover:border-emerald-500/40 transition-colors">
                        <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 font-mono">--tags {t.id}</span>
                        <p className="text-[9px] sm:text-[10px] text-slate-300 mt-1 leading-tight">{t.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {categories.sec.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[8px] sm:text-[9px] font-bold text-rose-500 uppercase pl-1">3. Security & Networking</span>
                    {categories.sec.map(t => (
                      <div key={t.id} className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl group hover:border-rose-500/40 transition-colors">
                        <span className="text-[9px] sm:text-[10px] font-bold text-rose-400 font-mono">--tags {t.id}</span>
                        <p className="text-[9px] sm:text-[10px] text-slate-300 mt-1 leading-tight">{t.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                {categories.post.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[8px] sm:text-[9px] font-bold text-amber-500 uppercase pl-1">4. Observability & Logs</span>
                    {categories.post.map(t => (
                      <div key={t.id} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl group hover:border-amber-500/40 transition-colors">
                        <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 font-mono">--tags {t.id}</span>
                        <p className="text-[9px] sm:text-[10px] text-slate-300 mt-1 leading-tight">{t.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedTagsInfo.length === 0 && (
              <div className="py-8 text-center bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl">
                <p className="text-xs text-slate-500 font-medium italic">Aucun tag spécifique sélectionné.<br/>Le playbook s'exécutera selon sa logique par défaut.</p>
              </div>
            )}
          </div>

          {/* FICHE TECHNIQUE DÉTAILLÉE */}
          <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
              <span className="text-6xl sm:text-8xl font-black italic">M472</span>
            </div>
            
            <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
              Fiche Technique de l'action
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 sm:gap-x-12">
              {[
                { label: "Inventaire source", value: `inventories/${config.environment}/`, isCode: true },
                { label: "Mode d'exécution", value: config.checkMode ? 'Simulation (--check)' : 'Application directe', highlight: config.checkMode ? 'text-amber-500' : 'text-emerald-500' },
                { label: "Gestion des Secrets", value: config.vaultPassword ? 'Vault Pass File' : 'Ask-Pass (Prompt)', highlight: config.vaultPassword ? 'text-emerald-500' : 'text-rose-500' },
                { label: "SSH Strategy", value: "Linear / Pipelining", highlight: 'text-slate-300' },
                { label: "Utilisateur distant", value: config.remoteUser || 'System Default', highlight: 'text-indigo-400', isCode: true },
                { label: "Timeout SSH", value: config.timeout > 0 ? `${config.timeout}s` : 'Défaut', highlight: 'text-slate-300' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] sm:text-[11px] border-b border-slate-800/50 pb-1.5">
                  <span className="text-slate-500 font-medium">{item.label}</span>
                  <span className={`font-bold ${item.highlight || 'text-white'} ${item.isCode ? 'font-mono tracking-tight bg-black/20 px-1 rounded' : ''}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Badges d'options actives */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold text-indigo-400 uppercase">Tags : {config.tags.length}</div>
              {config.useMogendHome && <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase">Home Context ON</div>}
              {config.verbose && <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] font-bold text-amber-500 uppercase">VVV Logging</div>}
              {config.diff && <div className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400 uppercase">Diff Mode</div>}
              {config.forks && config.forks > 0 && <div className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400 uppercase">Forks: {config.forks}</div>}
            </div>
          </div>

          {/* WARNING BLOCK PROD */}
          {config.environment === 'prod' && !config.checkMode && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl sm:rounded-2xl flex items-center space-x-4 animate-pulse">
              <div className="shrink-0 w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center text-xl">⚠️</div>
              <div className="text-[10px] sm:text-xs text-rose-300 leading-tight">
                <strong>ALERTE PRODUCTION :</strong> Exécution directe (SANS CHECK) sur l'environnement de production. Risque de rupture de service.
              </div>
            </div>
          )}
        </div>

        {/* FIXED FOOTER */}
        <div className="shrink-0 px-6 sm:px-8 py-4 sm:py-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em] text-center sm:text-left">
            Forge M472 Analysis Engine — Industrial v3.5
          </p>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Fermer l'analyse
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandExplanationModal;
