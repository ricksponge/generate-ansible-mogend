
import React from 'react';

interface AnsibleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnsibleConfigModal: React.FC<AnsibleConfigModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const configSections = [
    {
      title: 'Defaults',
      items: [
        { key: 'inventory', value: 'inventories', desc: 'Chemin vers les inventaires par environnement.' },
        { key: 'roles_path', value: 'roles', desc: 'Répertoire contenant les rôles réutilisables.' },
        { key: 'forks', value: '1', desc: 'Nombre de processus parallèles (configuré pour la stabilité).' },
        { key: 'pipelining', value: 'True', desc: 'Optimisation SSH pour réduire le nombre de connexions.' },
        { key: 'strategy', value: 'linear', desc: 'Exécution tâche par tâche sur tous les hôtes.' }
      ]
    },
    {
      title: 'SSH Connection',
      items: [
        { key: 'retries', value: '5', desc: 'Nombre de tentatives en cas de timeout SSH.' },
        { key: 'control_path', value: '~/.ansible/cp/...', desc: 'Optimisation du multiplexage des sockets SSH.' },
        { key: 'ServerAliveInterval', value: '30', desc: 'Maintien de la connexion active.' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🛠️</span>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">Configuration Ansible (ansible.cfg)</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Paramètres d'exécution M472</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {configSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {section.items.map((item, i) => (
                  <div key={i} className="group bg-slate-950/50 border border-slate-800 p-3 rounded-xl hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <code className="text-emerald-400 text-xs font-mono">{item.key}</code>
                      <code className="text-amber-500 text-xs font-mono bg-amber-500/10 px-1.5 rounded">{item.value}</code>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Code brut</h4>
            <pre className="text-[10px] font-mono text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 leading-tight">
{`[defaults]
inventory = inventories
roles_path = roles
forks = 1
pipelining = True
strategy = linear
host_key_checking = False

[ssh_connection]
retries = 5
connect_timeout = 30`}
            </pre>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnsibleConfigModal;
