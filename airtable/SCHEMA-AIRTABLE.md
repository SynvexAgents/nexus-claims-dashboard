# Schema Airtable — Nexus Claims Agent

## Vue d'ensemble

| Table | Role | Nb champs | Volume estime |
|-------|------|-----------|---------------|
| **Dossiers** | Table principale — chaque demande de remboursement | 25 | ~27 000/an |
| **Templates Email** | 42 templates de reponse categorises | 8 | 42 (fixe) |
| **Conditions Generales** | Articles CG BEsafe — regles metier | 7 | ~15 articles |
| **Historique Assures** | Profil anti-fraude par assure | 9 | ~20 000/an |

---

## Table 1 : Dossiers

| Champ | Type Airtable | Description | Exemple |
|-------|---------------|-------------|---------|
| ref_dossier | Autonumber (format REF-2026-XXXXX) | Reference unique | REF-2026-04891 |
| nom_assure | Single line text | Nom complet | Gabriel Mercier |
| email_assure | Email | Email assure | g.mercier@email.fr |
| telephone | Phone | Optionnel | +33 6 12 34 56 78 |
| montant_dossard | Currency (EUR) | Montant du dossard (10-500 EUR) | 189.00 |
| nom_evenement | Single line text | Nom de l'evenement sportif | UTMB |
| plateforme | Single line text | Plateforme partenaire | Finishers |
| date_souscription | Date | Date souscription assurance | 2026-01-15 |
| date_evenement | Date | Date evenement sportif | 2026-08-28 |
| date_annulation | Date | Date demande annulation | 2026-03-20 |
| date_reception | Date/Time | Horodatage reception par l'agent | 2026-03-20 09:14 |
| date_reponse | Date/Time | Horodatage reponse envoyee | 2026-03-20 09:16 |
| motif_declare | Single select | Motif principal | Options: Blessure, Maladie, Professionnel, Personnel, Familial, Autre |
| motif_detail | Long text | Description libre du motif | Fracture du tibia droit... |
| source | Single select | Canal de reception | Options: outlook, ticketing_api |
| document_analysis | Long text | JSON resultat analyse OCR (W2) | {"type_document": "certificat_medical", ...} |
| score_confiance | Number (0-100) | Score de confiance W3 | 95 |
| decision | Single select | Decision de l'agent | Options: auto_valide, attente, esclade |
| raison_decision | Long text | Justification W3 | Dossier complet et coherent... |
| anomalies | Long text | JSON anomalies detectees W3 | [{"type": "temporelle", ...}] |
| template_utilise | Link to Templates Email | Template selectionne | ACC_BLE_001 |
| status | Single select | Statut actuel du dossier | Options: nouveau, analyse, traite, attente, esclade, reclamation, clos |
| correction_humaine | Long text | Correction du gestionnaire (si applicable) | Les soins kine sont couverts... |
| email_envoye | Long text | Copie email envoye | Cher Monsieur Mercier... |
| pieces_jointes | Attachment | Documents originaux (PDF, images) | certificat.pdf |
| niveau_urgence | Single select | Priorite | Options: normal, prioritaire |

---

## Table 2 : Templates Email

| Champ | Type Airtable | Description | Exemple |
|-------|---------------|-------------|---------|
| template_id | Single line text | ID unique | ACC_BLE_001 |
| categorie | Single select | Categorie principale | Options: Acceptation Blessure, Acceptation Maladie, Acceptation Professionnel, Acceptation Familial, Refus Motif, Refus Delai, Complement, Reclamation |
| sous_categorie | Single line text | Sous-type specifique | Fracture |
| decision_type | Single select | Type de decision | Options: acceptation, refus, complement, reclamation |
| objet_email | Single line text | Objet avec variables | Assur Connect — Prise en charge {{ref_dossier}} |
| corps_email | Long text | Corps avec variables {{}} | Cher(e) {{nom_assure}}, ... |
| variables_requises | Multiple select | Variables utilisees | Options: nom_assure, ref_dossier, montant, motif, date_evenement, nom_evenement, delai, article_cg, document_manquant |
| actif | Checkbox | Template actif/inactif | true |

---

## Table 3 : Conditions Generales

| Champ | Type Airtable | Description | Exemple |
|-------|---------------|-------------|---------|
| article | Single line text | Numero d'article | Art. 2.1 |
| titre | Single line text | Titre de l'article | Motifs d'annulation couverts |
| contenu | Long text | Texte complet | Sont couverts : blessure, maladie... |
| motifs_couverts | Multiple select | Motifs couverts par cet article | Options: Blessure, Maladie, Professionnel, Familial |
| exclusions | Long text | Cas d'exclusion | Changement d'avis, indisponibilite... |
| delais | Single line text | Delais applicables | 5 jours ouvres |
| montant_max | Currency | Plafond si applicable | 500.00 |

---

## Table 4 : Historique Assures

| Champ | Type Airtable | Description | Exemple |
|-------|---------------|-------------|---------|
| email_assure | Email | Cle unique (email) | g.mercier@email.fr |
| nom | Single line text | Nom complet | Gabriel Mercier |
| nb_demandes_total | Count (Rollup from Dossiers) | Nombre total de demandes | 1 |
| nb_demandes_6mois | Formula | Demandes < 6 mois | 1 |
| taux_acceptation | Formula | % accepte | 100% |
| montant_total_rembourse | Rollup (Sum from Dossiers) | Total rembourse | 189.00 |
| dossiers | Link to Dossiers | Dossiers lies | [REF-2026-04891] |
| flag_suspect | Checkbox | Pattern suspect detecte | false |
| notes_gestionnaire | Long text | Notes manuelles du gestionnaire | RAS |

---

## Relations entre tables

```
Dossiers.template_utilise → Templates Email (link)
Dossiers.email_assure → Historique Assures.email_assure (lookup)
Historique Assures.dossiers → Dossiers (link, reverse)
Conditions Generales.motifs_couverts → utilise par W3 pour verification
```

## Formules Airtable

### Historique Assures — nb_demandes_6mois
```
COUNTALL(
  IF(
    AND(
      {Dossiers.date_reception} >= DATEADD(TODAY(), -6, 'months'),
      {Dossiers.email_assure} = {email_assure}
    ),
    1, 0
  )
)
```

### Historique Assures — taux_acceptation
```
IF(
  {nb_demandes_total} > 0,
  ROUND({nb_acceptes} / {nb_demandes_total} * 100, 1) & "%",
  "N/A"
)
```
