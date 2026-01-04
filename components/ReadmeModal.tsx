
import React from 'react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Documentation Industrielle MOGEND</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">M472 — ANFSI / SPWSI — SOCLE DE DÉPLOIEMENT</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar bg-slate-900/30">
          
          {/* ASCII BANNER */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl font-mono text-emerald-400 text-[9px] sm:text-[10px] leading-tight overflow-x-auto shadow-inner">
<pre>{`# =====================================================
#            M472 – MORICE / Datafari
# =====================================================

███╗   ███╗ ██████╗  ██████╗ ███████╗███╗   ██╗██████╗
████╗ ████║██╔═══██╗██╔════╝ ██╔════╝████╗  ██║██╔══██╗
██╔████╔██║██║   ██║██║  ███╗█████╗  ██╔██╗ ██║██║  ██║
██║╚██╔╝██║██║   ██║██║   ██║██╔══╝  ██║╚██╗██║██║  ██║
██║ ╚═╝ ██║╚██████╔╝╚██████╔╝███████╗██║ ╚████║██████╔╝
╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═════╝

#  MOGEND – MORICE ORCHESTRATOR
#  Déploiement · Exploitation · MCO / MCS
#  Projet : M472 – ANFSI / SPWSI
# =====================================================`}</pre>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Navigation / Summary */}
            <div className="lg:col-span-3 space-y-4 hidden lg:block">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Sommaire</h4>
              <nav className="flex flex-col space-y-2 text-[11px] text-slate-400">
                {[
                  "1. Objectif", "2. Pré-requis", "3. Structure", "4. Secrets", "5. Lancement", 
                  "6. run.sh", "7. Logs", "8. Phases", "9. Sécurité", "10. PRA / PCA",
                  "11. Support", "12. Avertissement", "13. Documentation", "14. Variables", "15. Exploitation"
                ].map((item, i) => (
                  <div key={i} className="hover:text-indigo-400 cursor-default transition-colors flex items-center">
                    <span className="w-4 text-slate-600">{i+1}.</span> {item.split('. ')[1]}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Column: Full Text */}
            <div className="lg:col-span-9 space-y-12">
              
              <section id="s1" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-emerald-500 pl-4">1. Objectif du projet</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  MOGEND est un outillage <strong>Ansible industriel</strong> permettant le <strong>déploiement, la configuration, la sécurisation et l’exploitation (MCO/MCS)</strong> de la plateforme <strong>MORICE (Datafari)</strong> sur les environnements <strong>QUAL / PREPROD / PROD</strong>.
                </p>
                <div className="grid grid-cols-2 gap-4 text-[11px] text-emerald-400 font-mono">
                  <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">✔ reproductibilité</div>
                  <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">✔ traçabilité</div>
                  <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">✔ conformité STIG / ANSSI</div>
                  <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">✔ capacité PRA / PCA</div>
                </div>
              </section>

              <section id="s2" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-indigo-500 pl-4">2. Pré‑requis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Poste d’administration</h4>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      <li>Linux (Debian/Ubuntu recommandé)</li>
                      <li>Ansible ≥ 2.15</li>
                      <li>Accès SSH aux VM cibles</li>
                      <li>Droits sudo</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Cibles</h4>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      <li>Debian 12</li>
                      <li>Accès réseau ADM / MET conforme</li>
                      <li>DNS et certificats disponibles</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="s3" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-indigo-500 pl-4">3. Structure du projet</h3>
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-blue-400">
<pre>{`MOGEND/
├── playbooks/         # Recettes Ansible orchestratrices
├── roles/mogend/      # Logique modulaire métier
├── inventories/       # Configuration des hôtes
│   ├── qual/
│   ├── preprod/
│   └── prod/
├── group_vars/        # Variables globales
│   └── all.yml        # FICHIER CRITIQUE
├── logs/              # Journaux d'exécution
└── run.sh             # Point d'entrée scripté`}</pre>
                </div>
              </section>

              <section id="s4" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-rose-500 pl-4">4. Gestion des secrets (OBLIGATOIRE)</h3>
                <p className="text-slate-300 text-sm">Les secrets sont centralisés dans <code>group_vars/all.yml</code>.</p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-rose-400">
<pre>{`# Exemple group_vars/all.yml
password_postgresql: "à remplir"
ansible_ssh_pass: "à remplir"
ansible_become_pass: "à remplir"`}</pre>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-center space-x-3">
                  <span className="text-xl">👉</span>
                  <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">Ce fichier doit impérativement être encrypter avec vault-ansible avant commit.</p>
                </div>
              </section>

              <section id="s5" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-emerald-500 pl-4">5. Lancement du déploiement</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Déploiement complet</h4>
                    <code className="block bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-400 text-xs font-mono">
                      chmod +x run.sh && ./run.sh
                    </code>
                  </div>
                  <p className="text-slate-400 text-xs italic">L'exécution peut également se faire de manière ciblée via les tags Ansible.</p>
                </div>
              </section>

              <section id="s8" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-indigo-500 pl-4">8. Phases de déploiement</h3>
                <p className="text-slate-400 text-xs italic">Le déploiement suit une chaîne <strong>bloquante</strong> de 11 étapes majeures :</p>
                <div className="space-y-2">
                  {[
                    "Bootstrap système", "Prechecks", "Installation Datafari", "Certificats TLS", 
                    "Configuration applicative", "MCF / OCR / Tika", "SSO / Apache / CORS", 
                    "Supervision", "Post‑installation", "Sauvegardes", "Durcissement final"
                  ].map((phase, i) => (
                    <div key={i} className="flex items-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <span className="w-6 h-6 flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded-lg mr-4 text-[10px] font-bold border border-indigo-500/30">{i+1}</span>
                      <span className="text-sm text-slate-300 font-medium">{phase}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section id="s13" className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-indigo-500 pl-4">13. Documentation des phases et des tâches</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  La <strong>logique complète du déploiement</strong> est volontairement <strong>externalisée et documentée</strong> afin de garantir la lisibilité, l’auditabilité et la reprise par un tiers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-3">
                    <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center">
                      <span className="mr-2">📁</span> phases.md
                    </h4>
                    <p className="text-[11px] text-slate-400 italic">Détail de la chaîne MCO/MCS, points bloquants et référence PRA/PCA.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-3">
                    <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center">
                      <span className="mr-2">📁</span> tasks.md
                    </h4>
                    <p className="text-[11px] text-slate-400 italic">Détail exhaustif des playbooks, rôles, impacts techniques et risques associés.</p>
                  </div>
                </div>
              </section>

              <section id="s14" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-rose-500 pl-4">14. Gestion des variables – règle stricte</h3>
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <p className="text-slate-300 text-sm">
                    Les seules variables modifiables sont situées dans : 
                    <code className="ml-2 text-rose-400 font-mono">group_vars/&lt;env&gt;/all.yml</code>
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-start"><span className="text-rose-500 mr-2">●</span> <strong>Règle impérative :</strong> Doit être chiffré via Ansible Vault.</li>
                    <li className="flex items-start"><span className="text-rose-500 mr-2">●</span> <strong>Zéro secret :</strong> Aucun mot de passe en clair dans run.sh ou les playbooks.</li>
                    <li className="flex items-start"><span className="text-rose-500 mr-2">●</span> <strong>Isolation :</strong> Séparation stricte entre le code Ansible et la configuration métier.</li>
                  </ul>
                </div>
              </section>

              <section id="s15" className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center border-l-4 border-emerald-500 pl-4">15. Principe d’exploitation</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cette organisation garantit l'industrialisation complète : séparation code/secrets, conformité sécurité, facilité d'audit et reprise rapide par un autre exploitant.
                </p>
                <div className="flex justify-center pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">MOGEND – SOCLE INDUSTRIEL DATAFARI</p>
                    <p className="text-[9px] text-slate-700 font-mono">SÉCURITÉ DÉFENSE — CONFIDENTIEL</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
          <p className="text-[10px] text-slate-500 font-mono italic">DOCUMENTATION OFFICIELLE M472 / SPWSI — v3.4</p>
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Fermer le manuel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadmeModal;
