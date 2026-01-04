
import React, { useState } from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'archi' | 'flux'>('archi');

  if (!isOpen) return null;

  const fluxData = [
    { source: 'CLIENT/ADMIN', dest: 'SSO PROXYMA', protocol: 'HTTPS/TCP/443', desc: 'Connexion sécurisée' },
    { source: 'VS SSO', dest: 'VS PRINCIPAL', protocol: 'HTTPS/TCP/443', desc: 'Authentification' },
    { source: 'VS PRINCIPAL', dest: 'VM PRINCIPAL', protocol: 'HTTPS/TCP/443', desc: 'Accès page web admin' },
    { source: 'VM PRINCIPAL', dest: 'VM RECHERCHE', protocol: 'SSH/2222, ZK/2181, HTTPS/443', desc: 'Sync Zookeeper / Bash' },
    { source: 'VM PRINCIPAL', dest: 'VM CONNECTEUR', protocol: 'SSH/2222, HTTPS/443', desc: 'Gestion connecteurs' },
    { source: 'VM PRINCIPAL', dest: 'POSTGRESQL', protocol: 'TCP/5432', desc: 'Base de données' },
    { source: 'VM PRINCIPAL', dest: 'NAS (NFS)', protocol: 'TCP/2049', desc: 'Stockage partagé' },
    { source: 'VM PRINCIPAL', dest: 'IPMS (MAIL)', protocol: 'TCP/25/SMTP', desc: 'Alerting' },
    { source: 'VM RECHERCHE', dest: 'VM PRINCIPAL', protocol: 'TCP/12500, HTTPS/443', desc: 'Logs / Requêtes MCF' },
    { source: 'VM CONNECTEUR', dest: 'IPMS (WEB)', protocol: 'TCP/80, 443', desc: 'Indexation web externe' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl">🏗️</div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Schéma d'Architecture & Flux</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Infrastructure M90 - MORICE - v1.0 Production</p>
            </div>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('archi')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'archi' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Architecture
            </button>
            <button 
              onClick={() => setActiveTab('flux')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'flux' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Matrice des Flux
            </button>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">×</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 custom-scrollbar bg-slate-950/20">
          {activeTab === 'archi' ? (
            <div className="relative min-h-[600px] flex flex-col items-center justify-center space-y-12">
              {/* External Layer */}
              <div className="flex justify-center space-x-12">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                  <span className="block text-xl mb-1">👤</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Utilisateur</span>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                  <span className="block text-xl mb-1">🛡️</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SSO Proxyma</span>
                </div>
              </div>

              {/* LB / VS Layer */}
              <div className="w-full max-w-md p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-[10px] font-bold text-white rounded-full">VS PRINCIPAL</div>
                <span className="text-sm font-bold text-indigo-400">Load Balancer / VIP</span>
              </div>

              {/* Cluster Layer */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[
                  { name: 'Pool Principal', color: 'border-rose-500/30 bg-rose-500/5', items: ['Tomcat UI', 'Solr Analytics', 'Cassandra', 'Logstash'] },
                  { name: 'Pool Recherche', color: 'border-amber-500/30 bg-amber-500/5', items: ['SolrCloud', 'Zookeeper', 'Logstash'] },
                  { name: 'Pool Connecteur', color: 'border-emerald-500/30 bg-emerald-500/5', items: ['Tomcat MCF', 'Tika', 'Zookeeper'] },
                  { name: 'Pool OCR', color: 'border-indigo-500/30 bg-indigo-500/5', items: ['Tomcat MCF', 'OCR Engine', 'Tika'] },
                ].map((pool, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl border ${pool.color} relative overflow-hidden group hover:border-white/20 transition-all`}>
                    <h4 className="text-xs font-bold text-white uppercase mb-4 tracking-wider">{pool.name}</h4>
                    <div className="space-y-2">
                      {pool.items.map((item, i) => (
                        <div key={i} className="px-3 py-2 bg-slate-900/80 rounded-lg text-[10px] font-mono text-slate-400 border border-slate-800">
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 italic">Mode Actif/Passif</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Layer */}
              <div className="flex justify-center space-x-12 w-full pt-8">
                <div className="p-6 bg-slate-900 border border-slate-700 rounded-2xl w-64 text-center">
                  <span className="text-2xl block mb-2">🗄️</span>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">PostgreSQL 16</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Port 5432</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-700 rounded-2xl w-64 text-center">
                  <span className="text-2xl block mb-2">📂</span>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Partage NFS</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">100Go - /srv/nfs/morice</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center space-x-3 mb-6">
                <span className="text-xl">🛡️</span>
                <p className="text-xs text-amber-300 italic">
                  Note : Tous les flux sont restreints par le pare-feu <strong>nftables</strong> local sur chaque VM. Port SSH métier : <strong>2222</strong>.
                </p>
              </div>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700">Source</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700">Destination</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700">Protocole / Port</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700">Description fonctionnelle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fluxData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">{row.source}</td>
                        <td className="px-6 py-4 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">{row.dest}</td>
                        <td className="px-6 py-4 text-[11px] font-mono text-slate-300">{row.protocol}</td>
                        <td className="px-6 py-4 text-xs text-slate-400 italic leading-relaxed">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Standard IPMS / STIG</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Segmentation T3</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 font-mono italic">MOGEND TECHNICAL OVERVIEW — FORGE v3.5</p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureModal;
