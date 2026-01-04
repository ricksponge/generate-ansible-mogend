
import React from 'react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Banner Section */}
        <div className="h-48 bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 relative flex items-center px-10 border-b border-slate-700">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="z-10 flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <span className="text-4xl">🔎</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">MORICE.2</h1>
              <p className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Moteur de Recherche Interne Centralisé</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all border border-white/10"
          >
            ×
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          
          {/* Section 1: Introduction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="w-2 h-8 bg-indigo-500 rounded-full mr-4"></span>
                Présentation de la solution
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                Le projet <strong>MORICE</strong> est un moteur de recherche fédérée basé sur la plateforme <strong>Datafari Enterprise</strong>. Il est destiné à faciliter l'accès aux contenus internes de la Gendarmerie (applications métiers, intranets, bases de données) tout en garantissant une sécurité et une robustesse adaptées aux environnements sensibles.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-3 shadow-inner">
               <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <span>MOA</span> <span className="text-indigo-400">ANFSI</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <span>MOE</span> <span className="text-indigo-400">France Labs</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <span>Hébergeur</span> <span className="text-indigo-400">STIG</span>
               </div>
            </div>
          </div>

          {/* Section 2: Stack Technique */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="w-2 h-8 bg-emerald-500 rounded-full mr-4"></span>
              Fondations Techniques
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Apache Solr', v: '9.7', desc: 'Recherche & Indexation' },
                { name: 'Lucene', v: 'Core', desc: 'Index Inversé' },
                { name: 'ManifoldCF', v: '2.26', desc: 'Collecte de données' },
                { name: 'ZooKeeper', v: '3.9.2', desc: 'Coordination Cluster' },
                { name: 'Cassandra', v: '4.1.3', desc: 'Persistance' },
                { name: 'PostgreSQL', v: '15.4', desc: 'Métadonnées' },
                { name: 'Apache Tika', v: '2.9.2', desc: 'Extraction Contenu' },
                { name: 'Tomcat', v: '9.0.81', desc: 'Serveur Applicatif' },
              ].map((tech, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-colors group">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1">{tech.name}</div>
                  <div className="text-lg font-black text-white mb-1">{tech.v}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-tighter">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Fonctionnalités & Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fonctionnalités Clés</h4>
              <ul className="space-y-3">
                {[
                  'Recherche avancée & texte intégral',
                  'Suggestions automatiques & correction',
                  'Filtrage par facettes dynamiques',
                  'Exploitation via API REST sécurisée',
                  'Interface d’administration simplifiée'
                ].map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sources Indexées</h4>
              <div className="flex flex-wrap gap-2">
                {['CMS Drupal', 'Intranets', 'PostgreSQL', 'NAS / SMB', 'SharePoint', 'Alfresco', 'Confluence', 'Email IMAP'].map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400 font-bold uppercase">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Warning/Status */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl flex items-start space-x-4">
            <div className="text-2xl">🛡️</div>
            <div className="text-[11px] text-indigo-300 leading-relaxed italic">
              Conformité <strong>RDSI v1.2</strong> — La solution assure un haut niveau de confidentialité et de traçabilité, essentielle pour les briques critiques du système d'information de la Gendarmerie.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-4">
             <span className="text-[10px] text-slate-500 font-mono">MORICE.2 INDUSTRIAL OVERVIEW</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             <span className="text-[10px] text-slate-500 font-mono">SOCLE ACTIF</span>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Fermer la présentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal;
