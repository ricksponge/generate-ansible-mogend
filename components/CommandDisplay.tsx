
import React, { useState } from 'react';
import { CommandConfig } from '../types';
import CommandExplanationModal from './CommandExplanationModal';
import TerminalCopyModal from './TerminalCopyModal';

interface CommandDisplayProps {
  config: CommandConfig;
}

const CommandDisplay: React.FC<CommandDisplayProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);

  const generateCommand = () => {
    // 1. Définition des briques de base
    const playbook = 'playbooks/install.yml';
    const inventory = `inventories/${config.environment}/inventory.ini`;
    
    // 2. Construction de la liste des arguments Ansible
    const args: string[] = [];
    
    args.push(playbook);
    args.push(`-i ${inventory}`);
    
    if (config.limit && config.limit !== 'all') {
      args.push(`-l "${config.limit}"`);
    }

    if (config.tags && config.tags.length > 0) {
      args.push(`--tags "${config.tags.join(',')}"`);
    }

    if (config.skipTags && config.skipTags.length > 0) {
      args.push(`--skip-tags "${config.skipTags.join(',')}"`);
    }

    // Gestion Vault au sein d'Ansible
    const hasVault = config.vaultPassword && config.vaultPassword.trim().length > 0;
    if (hasVault) {
      args.push(`--vault-password-file .vault_pass`);
    } else {
      args.push(`--ask-vault-pass`);
    }

    // Paramètres avancés
    if (config.forks && config.forks > 0) args.push(`-f ${config.forks}`);
    if (config.timeout && config.timeout > 0) args.push(`--timeout ${config.timeout}`);
    if (config.remoteUser) args.push(`-u ${config.remoteUser}`);
    if (config.become) args.push(`--become`);
    if (config.verbose) args.push(`-vvv`);
    if (config.checkMode) args.push(`--check`);
    if (config.diff) args.push(`--diff`);
    if (config.step) args.push(`--step`);
    if (config.syntaxCheck) args.push(`--syntax-check`);
    if (config.listTasks) args.push(`--list-tasks`);
    if (config.listTags) args.push(`--list-tags`);
    if (config.startAtTask) args.push(`--start-at-task "${config.startAtTask}"`);
    if (config.extraVarsRaw) args.push(`-e "${config.extraVarsRaw}"`);

    // 3. Assemblage de la commande Ansible seule (avec multi-ligne)
    const ansiblePlaybookCmd = `ansible-playbook ${args.join(' \\\n  ')}`;

    // 4. Chaînage complet (Shell pipeline)
    let finalCmd = "";

    // A. Contexte du répertoire
    if (config.useMogendHome) {
      finalCmd += `cd "$MOGEND_HOME" && \\\n`;
    }

    // B. Préparation Vault (si applicable)
    if (hasVault) {
      finalCmd += `echo "${config.vaultPassword}" > .vault_pass && \\\n`;
    }

    // C. Exécution Ansible
    finalCmd += ansiblePlaybookCmd;

    // D. Nettoyage final (si applicable)
    if (hasVault) {
      finalCmd += ` && \\\nrm -f .vault_pass`;
    }

    return finalCmd;
  };

  const command = generateCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setIsTerminalModalOpen(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <CommandExplanationModal 
        isOpen={isExplanationOpen} 
        onClose={() => setIsExplanationOpen(false)} 
        config={config} 
      />

      <TerminalCopyModal
        isOpen={isTerminalModalOpen}
        onClose={() => setIsTerminalModalOpen(false)}
        command={command}
      />
      
      <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ansible Playbook Generator</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsExplanationOpen(true)}
              className="px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 flex items-center border border-indigo-500/30"
            >
              <span className="mr-1">💡</span> Info
            </button>
            <button
              onClick={handleCopy}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                copied ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>
        </div>
        <div className="p-6 overflow-x-auto bg-[#0d1117]">
          <code className="text-emerald-400 font-mono text-sm block whitespace-pre-wrap leading-relaxed">
            <span className="text-slate-600 select-none mr-3"># M472 Production Execution</span>
            <br />
            <span className="text-slate-500 select-none mr-2">$</span>
            {command}
          </code>
        </div>
      </div>
    </div>
  );
};

export default CommandDisplay;
