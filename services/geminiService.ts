
import { GoogleGenAI, Type } from "@google/genai";
import { CommandConfig, Environment, Action } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function interpretNaturalLanguageCommand(prompt: string): Promise<Partial<CommandConfig>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following user request into a JSON configuration for a MOGEND Ansible deployment (M472 Project).
    User request: "${prompt}"
    
    Environments: qual, preprod, prod.
    Actions: deploy, restart, stop, rollback, maintenance.
    Phases: phase_precheck, phase_install, phase_configuration, phase_frontend, phase_services, phase_start, phase_deployment, full_pipeline, phase_backup.
    Specific machine groups for 'limit': all, main, solr, mcf1, mcf2.
    
    New Advanced options to detect:
    - "diff" / "différence": set diff: true
    - "pas à pas" / "confirmation": set step: true
    - "syntaxe" / "vérifier code": set syntaxCheck: true
    - "tâches" / "lister": set listTasks: true
    - "recommencer à" / "reprendre à": set startAtTask with provided value
    - "timeout" / "attente": set timeout with provided integer value
    
    If the user mentions "deploy" or "déploiement", use phase: 'phase_deployment'.
    If the user mentions "tout" or "complet", use phase: 'full_pipeline'.
    If the user specifies a target like "sur mcf1" or "uniquement solr", map it to the 'limit' field.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          project: { type: Type.STRING },
          environment: { type: Type.STRING, enum: ['qual', 'preprod', 'prod'] },
          action: { type: Type.STRING, enum: ['deploy', 'restart', 'stop', 'rollback', 'maintenance'] },
          phase: { type: Type.STRING },
          limit: { type: Type.STRING },
          verbose: { type: Type.BOOLEAN },
          checkMode: { type: Type.BOOLEAN },
          diff: { type: Type.BOOLEAN },
          step: { type: Type.BOOLEAN },
          syntaxCheck: { type: Type.BOOLEAN },
          listTasks: { type: Type.BOOLEAN },
          timeout: { type: Type.INTEGER },
          startAtTask: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          skipTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          remoteUser: { type: Type.STRING },
          become: { type: Type.BOOLEAN },
          forks: { type: Type.INTEGER },
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    // Logic for tags based on interpreted phase
    if (data.phase === 'full_pipeline') {
      data.tags = ['copie', 'bootstrap', 'verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    } else if (data.phase === 'phase_deployment') {
      data.tags = ['verif', 'phase_precheck', 'phase_install', 'phase_configuration', 'phase_frontend', 'phase_mcf', 'phase_services', 'phase_start', 'phase_post', 'nftables', 'lancement', 'phase_backup', 'logs'];
    }
    return data;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {};
  }
}
