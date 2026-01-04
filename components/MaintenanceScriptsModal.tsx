
import React, { useState } from 'react';

interface MaintenanceScriptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MaintenanceScriptsModal: React.FC<MaintenanceScriptsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const scriptCategories = [
    {
      title: "Gestion des Services",
      icon: "⚡",
      scripts: [
        { name: "start-datafari.sh", desc: "Démarrage complet de tous les services de la plateforme." },
        { name: "stop-datafari.sh", desc: "Arrêt propre de l'ensemble des services (Tomcat, Solr, ZK, etc.)." },
        { name: "restart-datafari.sh", desc: "Redémarrage global sécurisé de la solution." },
        { name: "start-solr.sh / stop-solr.sh", desc: "Contrôle granulaire du moteur de recherche Apache Solr." },
        { name: "start-zk.sh / stop-zk.sh", desc: "Démarrage et arrêt du coordinateur de cluster Zookeeper." },
        { name: "monit-start-*.sh / monit-stop-*.sh", desc: "Actions de démarrage/arrêt pilotées par l'outil de supervision Monit." }
      ]
    },
    {
      title: "Sauvegardes & Restauration (PRA/PCA)",
      icon: "💾",
      scripts: [
        { name: "global_backup_script.sh", desc: "Exécution de la chaîne complète de sauvegarde (Data, Index, Conf)." },
        { name: "backup_solr.sh", desc: "Sauvegarde à chaud de l'index de recherche Solr." },
        { name: "backup_cassandra.sh", desc: "Extraction et backup de la base NoSQL Cassandra." },
        { name: "backup_mcf.sh", desc: "Sauvegarde de la base de données PostgreSQL de ManifoldCF (Connecteurs)." },
        { name: "restore_*.sh", desc: "Scripts miroirs permettant la restauration d'un composant spécifique à partir d'un dump." },
        { name: "global_backup_planification.sh", desc: "Configuration de la périodicité des sauvegardes via Crontab." }
      ]
    },
    {
      title: "Exploitation & Nettoyage",
      icon: "🧹",
      scripts: [
        { name: "datafari-manager.sh", desc: "Utilitaire centralisé pour les tâches d'administration courantes." },
        { name: "logPurge.sh", desc: "Rotation et purge des journaux d'exécution pour libérer de l'espace disque." },
        { name: "backupPurge.sh", desc: "Suppression automatique des anciennes sauvegardes selon la rétention définie." },
        { name: "analyticsPurge.sh", desc: "Nettoyage des données analytiques et statistiques d'usage." },
        { name: "vacuum-mcf.sh", desc: "Optimisation et maintenance de la base PostgreSQL de ManifoldCF." },
        { name: "patch-datafari.sh", desc: "Procédure d'application de correctifs et de mises à jour mineures." }
      ]
    },
    {
      title: "Monitoring & Analyse",
      icon: "📊",
      scripts: [
        { name: "global_monitor_script.sh", desc: "Script de supervision globale de l'état de santé du système." },
        { name: "generate_report.sh", desc: "Génération de rapports de monitoring périodiques sur l'usage." },
        { name: "getDatafariResponseTime.sh", desc: "Calcul du temps de latence de l'interface utilisateur (End-to-End)." },
        { name: "getSolrResponseTime.sh", desc: "Mesure de la performance brute du moteur de recherche." },
        { name: "directory_size_check.sh", desc: "Surveillance de l'occupation des volumes (NFS, Index, Logs)." },
        { name: "global_monitor_alerts.sh", desc: "Gestion de l'alerting système et des notifications critiques." }
      ]
    },
    {
      title: "Sécurité & Certificats",
      icon: "🔐",
      scripts: [
        { name: "configure-real-certificates.sh", desc: "Installation et mise à jour des certificats SSL/TLS réels." },
        { name: "global-configure-real-certificates.sh", desc: "Configuration multi-services des certificats (Apache + Java Keystores)." },
        { name: "import-certif.sh", desc: "Import manuel d'un certificat dans les keystores de confiance." },
        { name: "ipnames.properties", desc: "Fichier de mapping IP/FQDN pour les certificats SAN (Subject Alternative Name)." }
      ]
    }
  ];

  const filteredCategories = scriptCategories.map(cat => ({
    ...cat,
    scripts: cat.scripts.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.scripts.length > 0);

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-2xl">🛠️</div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Scripts de Maintenance & Exploitation</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest italic">Catalogue des utilitaires MOGEND / MORICE</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher un script..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-amber-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCategories.map((category, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.scripts.map((script, sIdx) => (
                    <div key={sIdx} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800 transition-all group">
                      <code className="text-[11px] font-mono text-indigo-400 group-hover:text-indigo-300 transition-colors block mb-2">{script.name}</code>
                      <p className="text-xs text-slate-400 leading-relaxed italic">{script.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600">
              <span className="text-4xl mb-4">💨</span>
              <p className="text-sm font-medium">Aucun script ne correspond à votre recherche.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500 text-xs">⚠️</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">L'exécution de ces scripts nécessite des droits ADM (sudo).</p>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            Fermer le catalogue
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScriptsModal;
