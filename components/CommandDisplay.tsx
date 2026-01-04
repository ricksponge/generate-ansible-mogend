
import React, { useState } from 'react';
import { CommandConfig } from '../types';
import CommandExplanationModal from './CommandExplanationModal';

interface CommandDisplayProps {
  config: CommandConfig;
}

const CommandDisplay: React.FC<CommandDisplayProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const generateCommand = () => {
    // According to M472 script logic
    const playbook = 'playbooks/install.yml';
    const inventory = `inventories/${config.environment}/inventory.ini`;
    
    let baseCmd = `ansible-playbook ${playbook} -i ${inventory}`;
    
    // Target constraint
    if (config.limit && config.limit !== 'all') {
      baseCmd += ` -l "${config.limit}"`;
    }

    // Tags handling
    if (config.tags && config.tags.length > 0) {
      baseCmd += ` --tags "${config.tags.join(',')}"`;
    }

    if (config.skipTags && config.skipTags.length > 0) {
      baseCmd += ` --skip-tags "${config.skipTags.join(',')}"`;
    }

    // Vault handling - Only if explicitly filled
    if (config.vaultPassword && config.vaultPassword.trim().length > 0) {
      baseCmd = `echo "${config.vaultPassword}" > .vault_pass && ` + baseCmd + ` --vault-password-file .vault_pass && rm .vault_pass`;
    } else {
      baseCmd += ` --ask-vault-pass`;
    }

    // Advanced Flags - Only if > 0 or not empty
    if (config.forks && config.forks > 0) {
      baseCmd += ` -f ${config.forks}`;
    }

    if (config.timeout && config.timeout > 0) {
      baseCmd += ` --timeout ${config.timeout}`;
    }

    if (config.remoteUser) {
      baseCmd += ` -u ${config.remoteUser}`;
    }

    // Toggles
    if (config.verbose) baseCmd += ` -vvv`;
    if (config.checkMode) baseCmd += ` --check`;
    if (config.diff) baseCmd += ` --diff`;
    if (config.step) baseCmd += ` --step`;
    if (config.syntaxCheck) baseCmd += ` --syntax-check`;
    if (config.listTasks) baseCmd += ` --list-tasks`;
    if (config.listTags) baseCmd += ` --list-tags`;

    if (config.startAtTask) {
      baseCmd += ` --start-at-task "${config.startAtTask}"`;
    }

    if (config.extraVarsRaw) {
      baseCmd += ` -e "${config.extraVarsRaw}"`;
    }

    // MOGEND_HOME Prefix
    if (config.useMogendHome) {
      return `cd "$MOGEND_HOME" && \\\n${baseCmd}`;
    }

    return baseCmd;
  };

  const command = generateCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <CommandExplanationModal 
        isOpen={isExplanationOpen} 
        onClose={() => setIsExplanationOpen(false)} 
        config={config} 
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
                copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
