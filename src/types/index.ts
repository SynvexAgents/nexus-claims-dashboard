export type MotifDeclare = 'Blessure' | 'Maladie' | 'Professionnel' | 'Personnel' | 'Familial' | 'Autre'

export type Decision = 'auto_validé' | 'attente' | 'escaladé'

export type DossierStatus = 'nouveau' | 'analysé' | 'traité' | 'attente' | 'escaladé' | 'réclamation' | 'clos'

export type AnomalieType = 'temporelle' | 'documentaire' | 'comportementale'

export type AnomalieSeverite = 'critique' | 'elevee' | 'moyenne' | 'faible'

export type NiveauUrgence = 'normal' | 'prioritaire'

export interface Anomalie {
  type: AnomalieType
  description: string
  severite: AnomalieSeverite
  impact_score: number
  reference_cg?: string
}

export interface ScoreDetail {
  score_base: number
  deductions: { raison: string; impact: number }[]
  score_final: number
}

export interface DocumentAnalysis {
  type_document: string
  date_document: string
  emetteur: {
    nom: string
    qualite: string
    coordonnees_presentes: boolean
  }
  motif_extrait: string
  diagnostic?: string
  dates_indisponibilite: {
    debut: string | null
    fin: string | null
  }
  coherence_apparente: 'oui' | 'non' | 'incertain'
  raison_incoherence?: string
  signes_modification: 'oui' | 'non'
  detail_modification?: string
  qualite_document: 'bon' | 'moyen' | 'mauvais' | 'illisible'
  informations_manquantes: string[]
  lien_sport?: 'oui' | 'non' | 'incertain'
  notes?: string
}

export interface Dossier {
  id: string
  ref_dossier: string
  nom_assure: string
  email_assure: string
  telephone?: string
  montant_dossard: number
  nom_evenement: string
  plateforme: string
  date_souscription: string
  date_evenement: string
  date_annulation: string
  date_reception: string
  date_reponse?: string
  motif_declare: MotifDeclare
  motif_detail: string
  source: 'outlook' | 'ticketing_api' | 'webhook_test'
  document_analysis?: DocumentAnalysis
  score_confiance: number
  score_details?: ScoreDetail
  decision: Decision
  raison_decision: string
  anomalies: Anomalie[]
  template_utilise?: string
  status: DossierStatus
  correction_humaine?: string
  email_envoye?: string
  niveau_urgence: NiveauUrgence
  historique_assure: {
    nb_demandes_total: number
    nb_demandes_6mois: number
    montant_total_rembourse: number
    flag_suspect: boolean
  }
}

export interface ActivityItem {
  id: string
  type: 'auto_validé' | 'attente' | 'escaladé' | 'analyse' | 'email_envoyé' | 'réclamation'
  message: string
  ref_dossier: string
  score?: number
  timestamp: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

export interface KPIData {
  label: string
  value: number
  suffix?: string
  prefix?: string
  trend: number
  trendLabel: string
  sparkline: number[]
  icon: string
  color: string
  glowClass: string
}

export type PageId = 'dashboard' | 'dossiers' | 'anomalies' | 'chat'
