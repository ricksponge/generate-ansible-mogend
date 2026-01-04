
import React, { useState } from 'react';
import { interpretNaturalLanguageCommand } from '../services/geminiService';
import { CommandConfig } from '../types';

interface AiAssistantProps {
  onApplyConfig: (config: Partial<CommandConfig>) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onApplyConfig }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await interpretNaturalLanguageCommand(input);
      onApplyConfig(result);
      setInput('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 mb-8">
      <div className="flex items-center mb-3">
        <span className="text-xl mr-2">✨</span>
        <h3 className="font-semibold text-indigo-300">AI Command Assistant</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        Describe what you want to achieve in plain English/French (e.g., "Deploy worker node to staging with debug logs")
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
          placeholder="Type your request here..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button
          onClick={handleSuggest}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Generate'
          )}
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
