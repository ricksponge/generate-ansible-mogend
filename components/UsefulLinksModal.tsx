
import React from 'react';

interface UsefulLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsefulLinksModal: React.FC<UsefulLinksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const links = [
    {
      title: "Jira HEB (Hébergement)",
      desc: "Suivi des tickets d'infrastructure et d'hébergement STIG.",
      url: "https://jira.gendarmerie.fr/browse/HEB-324?jql=project%20%3D%20HEB%20AND%20text%20~%20morice",
      icon: "🎫",
      color: "border-blue-500/30 text-blue-400 bg-blue-500/5"
    },
    {
      title: "Jira DSDS (Raccordement)",
      desc: "Suivi des demandes de raccordement et d'accès réseau.",
      url: "https://jira.gendarmerie.fr/browse/DSDS-354",
      icon: "🔌",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/5"
    },
    {
      title: "Jira Projet (MOTINTRANE)",
      desc: "Gestion des développements et anomalies du projet MORICE.",
      url: "https://jira.gendarmerie.fr/projects/MOTINTRANE/issues/MOTINTRANE-471?filter=allopenissues",
      icon: "🚀",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
    },
    {
      title: "Confluence Documentation",
      desc: "Base de connaissance technique et fonctionnelle du projet.",
      url: "https://confluence.gendarmerie.fr/pages/viewpage.action?pageId=548962595",
      icon: "📚",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
    }
  ];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">🔗</span>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Liens Utiles & Écosystème</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Accès rapides aux outils de pilotage M472</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-4">
          {links.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center p-4 rounded-2xl border ${link.color} hover:scale-[1.02] hover:border-white/20 transition-all group`}
            >
              <div className="text-3xl mr-5 group-hover:rotate-12 transition-transform">{link.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-sm uppercase tracking-wider group-hover:underline">{link.title}</h3>
                <p className="text-[11px] text-slate-400 italic mt-1">{link.desc}</p>
              </div>
              <div className="text-slate-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="px-8 py-6 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsefulLinksModal;
