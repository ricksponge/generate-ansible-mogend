
import { DeploymentProject, Environment, Action } from './types';

export interface PhaseConfig {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface TagConfig {
  id: string;
  description: string;
}

export const PROJECTS: DeploymentProject[] = [
  { id: 'datafari-core', name: 'Datafari Core', icon: '🔍', playbook: 'install.yml' },
  { id: 'frontend-ui', name: 'Frontend MORICE', icon: '🎨', playbook: 'install.yml' },
  { id: 'solr-engine', name: 'Solr Search', icon: '⚡', playbook: 'install.yml' },
  { id: 'mcf-connector', name: 'MCF Connectors', icon: '🔗', playbook: 'install.yml' },
  { id: 'apache-sso', name: 'Apache & SSO', icon: '🔐', playbook: 'install.yml' },
];

export const ENVIRONMENTS = [
  { value: 'qual', label: 'Qualif', color: 'bg-emerald-600' },
  { value: 'preprod', label: 'Preprod', color: 'bg-blue-600' },
  { value: 'prod', label: 'Production', color: 'bg-rose-600' },
];

export const PHASES: PhaseConfig[] = [
  { 
    value: 'phase_precheck', 
    label: 'Precheck', 
    icon: '📋',
    description: 'Vérification OS (Debian), variables obligatoires, cohérence système et réapplication du durcissement SSH.'
  },
  { 
    value: 'phase_install', 
    label: 'Installation', 
    icon: '📥',
    description: 'Désinstallation propre et installation de Datafari (Tomcat, Solr, ManifoldCF, Tika).'
  },
  { 
    value: 'phase_configuration', 
    label: 'Config Globale', 
    icon: '⚙️',
    description: 'Déploiement des certificats TLS réels, mise à jour des keystores Java et cohérence PKI.'
  },
  { 
    value: 'phase_frontend', 
    label: 'Frontend', 
    icon: '🖥️',
    description: 'Configuration datafari.properties, build de l’UI MORICE et personnalisation de la sidebar métier.'
  },
  { 
    value: 'phase_services', 
    label: 'Services (SSO)', 
    icon: '🌐',
    description: 'Configuration Apache pour le SSO, règles CORS et test de vivacité applicative.'
  },
  { 
    value: 'phase_start', 
    label: 'Start / Monit', 
    icon: '🚀',
    description: 'Déploiement des scripts de monitoring et démarrage des services consolidés.'
  },
  { 
    value: 'phase_deployment', 
    label: 'Déploiement', 
    icon: '📦',
    description: 'Pipeline de déploiement standard incluant Precheck, Install, Config, Frontend et Start.'
  },
  { 
    value: 'full_pipeline', 
    label: 'Pipeline Complète', 
    icon: '⚡',
    description: 'Séquence totale : Bootstrap système, Prechecks, Installation, Services, Backup et Logs.'
  },
  { 
    value: 'phase_backup', 
    label: 'Backup', 
    icon: '💾',
    description: 'Sauvegarde critique de Solr, ManifoldCF et des configurations pour le PRA/PCA.'
  },
];

export const COMMON_GROUPS = [
  { id: 'all', label: 'Tous (all)' },
  { id: 'main', label: 'Main' },
  { id: 'solr', label: 'Solr Nodes' },
  { id: 'mcf1', label: 'MCF1' },
  { id: 'mcf2', label: 'MCF2' },
];

export const SPECIFIC_TAGS: TagConfig[] = [
  { id: 'uninstall', description: 'Désinstallation maîtrisée de Datafari (arrêt services, nettoyage).' },
  { id: 'ssh', description: 'Durcissement de l’accès SSH métier sur le port 2222.' },
  { id: 'finger', description: 'Distribution des clés SSH et configuration des empreintes serveurs.' },
  { id: 'java_env', description: 'Normalisation de l’environnement Java Temurin (JAVA_HOME).' },
  { id: 'replace_certs', description: 'Rotation et déploiement multi-serveurs des certificats TLS.' },
  { id: 'verif_certilibre', description: 'Contrôle de la chaîne de confiance et compatibilité SSO Certilibre.' },
  { id: 'datafari_properties', description: 'Configuration structurante du cœur Datafari (API, endpoints).' },
  { id: 'application_properties', description: 'Configuration applicative Java fine (Webapp Datafari).' },
  { id: 'build_front', description: 'Génération et déploiement des assets de l’interface utilisateur.' },
  { id: 'sidebar', description: 'Personnalisation de la barre latérale JSP (branding, liens métiers).' },
  { id: 'tika', description: 'Configuration d’Apache Tika pour l’OCR et le parsing documentaire.' },
  { id: 'apache_sso_cors', description: 'Intégration SSO (ProxyMA/LLNG) et gestion des en-têtes CORS.' },
  { id: 'monitor_script', description: 'Déploiement des scripts de supervision locale (services, ports).' },
  { id: 'nftables', description: 'Configuration du pare-feu nftables (segmentation réseau).' },
  { id: 'fetch_log', description: 'Collecte et rapatriement des journaux techniques Datafari.' },
  { id: 'lancement', description: 'Playbook orchestrateur principal (chargement variables, rôles).' },
  { id: 'widget', description: 'Déploiement des widgets de liens métiers pour l’interface.' },
  { id: 'solr', description: 'Configuration et maintenance spécifique du moteur SolrCloud.' },
  { id: 'mcf', description: 'Configuration ManifoldCF (connecteurs, jobs d’indexation).' },
  { id: 'verif', description: 'Vérifications techniques post-action (processus, ports).' },
  { id: 'copie', description: 'Transfert sécurisé du binaire .deb Datafari sur les cibles.' },
  { id: 'logs', description: 'Archivage et export des logs vers le stockage externe.' }
];

export const ACTIONS = [
  { value: Action.DEPLOY, label: 'Run Playbook', icon: '▶️' },
  { value: Action.MAINTENANCE, label: 'Maintenance', icon: '🛠️' },
];
