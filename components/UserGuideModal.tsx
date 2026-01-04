
import React, { useState } from 'react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('intro');

  if (!isOpen) return null;

  const sections = [
    { id: 'intro', label: 'Introduction', icon: '🚀' },
    { id: 'accueil', label: 'Interface d\'accueil', icon: '🏠' },
    { id: 'resultats', label: 'Page de résultats', icon: '📄' },
    { id: 'filtres', label: 'Filtres & Facettes', icon: '🔍' },
    { id: 'favoris', label: 'Favoris & Alertes', icon: '⭐' },
    { id: 'widgets', label: 'Widgets Métiers', icon: '🧩' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-white uppercase italic">Bienvenue sur MORICE</h3>
            <p className="text-slate-300 leading-relaxed">
              Le moteur de recherche <strong>MORICE</strong> est un outil interne destiné aux gendarmes et personnels de la Gendarmerie pour retrouver rapidement l’information au sein de l’organisation.
            </p>
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Sources Connectées</h4>
              <p className="text-sm text-slate-400">
                Intranets, wikis métiers, bases documentaires (Mémorial), documentation technique, et bien plus encore, le tout centralisé sur une interface unique.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">Recherche Simple</span>
                <span className="text-[11px] text-slate-500">Mots-clés directs et suggestions automatiques.</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">Recherche Avancée</span>
                <span className="text-[11px] text-slate-500">Filtrage précis par dates, auteurs ou expressions exactes.</span>
              </div>
            </div>
          </div>
        );
      case 'accueil':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-white uppercase italic">Prise en main de l'accueil</h3>
            <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
              <div className="z-10 text-center p-8">
                <div className="w-full max-w-md mx-auto h-10 bg-slate-900 border border-slate-700 rounded-full flex items-center px-4 mb-4">
                  <span className="text-slate-600 text-xs">Rechercher un document...</span>
                  <span className="ml-auto text-slate-500">🔍</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Barre de recherche centrale avec autocomplétion</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <p className="text-sm text-slate-300">Saisissez vos mots-clés. Les <strong>suggestions automatiques</strong> apparaissent dès les premières lettres pour vous aider.</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <p className="text-sm text-slate-300">Validez avec <strong>Entrée</strong> ou la loupe. MORICE supporte la <strong>correction orthographique</strong> automatique.</p>
              </div>
            </div>
          </div>
        );
      case 'resultats':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-white uppercase italic">Analyse des résultats</h3>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-500">Résultats 1-10 sur 250</span>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">Trier par : Pertinence</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <h5 className="text-indigo-400 font-bold text-sm hover:underline cursor-pointer">Guide des procédures RH - Congés et Absences.pdf</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">...les modalités de pose de congés pour le personnel civil de la gendarmerie...</p>
                  <div className="flex space-x-3 mt-2">
                    <span className="text-[9px] text-slate-600 font-mono">Source: Intranet RH</span>
                    <span className="text-[9px] text-slate-600 font-mono">Type: PDF</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
               <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Astuce : Prévisualisation</span>
               <p className="text-[11px] text-slate-400 italic">Utilisez l'icône "œil" pour consulter un document sans le télécharger.</p>
            </div>
          </div>
        );
      case 'filtres':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-white uppercase italic">Utilisation des facettes</h3>
            <p className="text-slate-300 text-sm">Affinez votre recherche sans retaper votre requête grâce aux filtres latéraux.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Par Source (Origine)</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-400"><input type="checkbox" className="mr-2" checked disabled /> Intranet Gendarmerie</div>
                    <div className="flex items-center text-xs text-slate-400"><input type="checkbox" className="mr-2" /> Mémorial</div>
                    <div className="flex items-center text-xs text-slate-400"><input type="checkbox" className="mr-2" /> Wiki Métier</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Par Date de mise à jour</h5>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p className="hover:text-indigo-400 cursor-pointer">● Dernière semaine</p>
                    <p className="hover:text-indigo-400 cursor-pointer">● Dernier mois</p>
                    <p className="hover:text-indigo-400 cursor-pointer">● Plus d'un an</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'favoris':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-white uppercase italic">Outils de Veille</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-amber-400">
                  <span className="text-2xl">⭐</span>
                  <h4 className="font-bold text-sm uppercase">Gestion des Favoris</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cliquez sur l'étoile à côté d'un résultat pour le sauvegarder dans votre bibliothèque personnelle. Idéal pour les guides consultés quotidiennement.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-rose-400">
                  <span className="text-2xl">🔔</span>
                  <h4 className="font-bold text-sm uppercase">Alertes de recherche</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Soyez notifié par email dès qu'un nouveau document correspondant à votre veille est indexé (ex: "recrutement réservistes 2025").
                </p>
              </div>
            </div>
          </div>
        );
      case 'widgets':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-white uppercase italic">Accès directs & Annuaire</h3>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
              <div className="flex space-x-4 mb-6">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-2xl shadow-xl">📖</div>
                <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-2xl shadow-xl">🔗</div>
              </div>
              <h5 className="text-white font-bold text-sm mb-2">Widgets de la page d'accueil</h5>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Accédez à l'<strong>Annuaire Interne (Yellow Pages)</strong> pour trouver les coordonnées d'un agent ou utilisez les <strong>Liens directs</strong> pour lancer vos applications métiers préférées (GTA, Pulsar, CyberAide).
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[80vh] bg-slate-900 border border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-8 flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-lg font-black text-white tracking-tighter uppercase italic">Guide MORICE</h2>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em]">Manuel de l'utilisateur</p>
          </div>
          
          <nav className="flex-1 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all text-left ${
                  activeSection === section.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-wide">{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800 hidden md:block">
            <p className="text-[9px] text-slate-600 font-mono italic">Document de référence M472 — v1.2</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-slate-900/30">
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
            {renderContent()}
          </div>
          
          <div className="px-12 py-6 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Guide Officiel Gendarmerie</span>
            </div>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
            >
              Quitter le guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
