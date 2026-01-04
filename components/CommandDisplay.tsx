
import React, { useState } from 'react';
import { CommandConfig } from '../types';
import { PROJECTS } from '../constants';

interface CommandDisplayProps {
  config: CommandConfig;
}

const CommandDisplay: React.FC<CommandDisplayProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const generateCommand = () => {
    // According to M472 script logic
    const playbook = 'playbooks/install.yml';
    const inventory = `inventories/${config.environment}/inventory.ini`;
    
    let cmd = `ansible-playbook ${playbook} -i ${inventory}`;
    
    // Target constraint
    if (config.limit && config.limit !== 'all') {
      cmd += ` -l "${config.limit}"`;
    }

    // Tags handling
    if (config.tags && config.tags.length > 0) {
      cmd += ` --tags "${config.tags.join(',')}"`;
    }

    if (config.skipTags && config.skipTags.length > 0) {
      cmd += ` --skip-tags "${config.skipTags.join(',')}"`;
    }

    // Vault handling - Only if explicitly filled
    if (config.vaultPassword && config.vaultPassword.trim().length > 0) {
      cmd = `echo "${config.vaultPassword}" > .vault_pass && ` + cmd + ` --vault-password-file .vault_pass && rm .vault_pass`;
    } else {
      cmd += ` --ask-vault-pass`;
    }

    // Advanced Flags - Only if > 0 or not empty
    if (config.forks && config.forks > 0) {
      cmd += ` -f ${config.forks}`;
    }

    if (config.timeout && config.timeout > 0) {
      cmd += ` --timeout ${config.timeout}`;
    }

    if (config.remoteUser) {
      cmd += ` -u ${config.remoteUser}`;
    }

    // Toggles
    if (config.verbose) cmd += ` -vvv`;
    if (config.checkMode) cmd += ` --check`;
    if (config.diff) cmd += ` --diff`;
    if (config.step) cmd += ` --step`;
    if (config.syntaxCheck) cmd += ` --syntax-check`;
    if (config.listTasks) cmd += ` --list-tasks`;
    if (config.listTags) cmd += ` --list-tags`;

    if (config.startAtTask) {
      cmd += ` --start-at-task "${config.startAtTask}"`;
    }

    if (config.extraVarsRaw) {
      cmd += ` -e "${config.extraVarsRaw}"`;
    }

    return cmd;
  };

  const command = generateCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
      <div className="px-6 py-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ansible Playbook Generator</span>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
            copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {copied ? 'Copié' : 'Copier'}
        </button>
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
  );
};

export default CommandDisplay;
