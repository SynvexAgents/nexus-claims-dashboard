# Guide d'import Airtable — Nexus Claims Agent

## Etape 1 : Creer la base Airtable

1. Va sur **airtable.com** → "Create a base" → Nomme-la **"Nexus Claims Agent"**
2. Tu auras une table vide par defaut — renomme-la "Dossiers"

## Etape 2 : Importer les CSV

### Table "Templates Email"
1. Dans la base, clique **"+"** pour ajouter une table
2. Choisis **"Import data"** → **"CSV file"**
3. Selectionne le fichier **`templates-email.csv`**
4. Airtable va creer automatiquement les colonnes
5. Ajuste les types de colonnes :
   - `template_id` → Single line text
   - `categorie` → Single select
   - `decision_type` → Single select
   - `actif` → Checkbox
   - `variables_requises` → Single line text (ou Multiple select si tu veux)
6. Renomme la table → **"Templates Email"**

### Table "Conditions Generales"
1. Clique **"+"** → "Import data" → CSV → **`conditions-generales.csv`**
2. Ajuste les types :
   - `motifs_couverts` → Multiple select
   - `montant_max` → Currency (EUR)
3. Renomme → **"Conditions Generales"**

### Table "Historique Assures"
1. Clique **"+"** → "Import data" → CSV → **`historique-assures.csv`**
2. Ajuste les types :
   - `email_assure` → Email
   - `montant_total_rembourse` → Currency (EUR)
   - `flag_suspect` → Checkbox
3. Renomme → **"Historique Assures"**

### Table "Dossiers" (table principale)
La table Dossiers sera creee manuellement car elle contient des champs complexes (links, formulas).

1. Ouvre la table "Dossiers" (creee a l'etape 1)
2. Cree les colonnes suivantes (voir SCHEMA-AIRTABLE.md pour les details complets) :

**Colonnes essentielles :**
- `ref_dossier` → Autonumber
- `nom_assure` → Single line text
- `email_assure` → Email
- `montant_dossard` → Currency (EUR)
- `nom_evenement` → Single line text
- `plateforme` → Single line text
- `date_souscription` → Date
- `date_evenement` → Date
- `date_annulation` → Date
- `date_reception` → Date with time
- `motif_declare` → Single select (Blessure, Maladie, Professionnel, Personnel, Familial, Autre)
- `motif_detail` → Long text
- `source` → Single select (outlook, ticketing_api)
- `score_confiance` → Number
- `decision` → Single select (auto_valide, attente, esclade)
- `status` → Single select (nouveau, analyse, traite, attente, esclade, reclamation, clos)
- `template_utilise` → Link to "Templates Email"
- `raison_decision` → Long text
- `anomalies` → Long text
- `document_analysis` → Long text
- `correction_humaine` → Long text
- `email_envoye` → Long text
- `pieces_jointes` → Attachment
- `niveau_urgence` → Single select (normal, prioritaire)
- `date_reponse` → Date with time

## Etape 3 : Configurer les relations

1. Dans **Dossiers**, le champ `template_utilise` doit etre de type **"Link to another record"** → selectionne la table **"Templates Email"**
2. Dans **Historique Assures**, cree un champ `dossiers` de type **"Link to another record"** → selectionne **"Dossiers"**

## Etape 4 : Verifier

- **Templates Email** : 42 lignes
- **Conditions Generales** : 17 articles
- **Historique Assures** : 30 assures
- **Dossiers** : vide (sera rempli par les workflows n8n)

## Etape 5 : Recuperer l'API key

Pour connecter n8n a Airtable :
1. Va dans **Account** → **Developer hub** → **Personal access tokens**
2. Cree un token avec les scopes : `data.records:read`, `data.records:write`, `schema.bases:read`
3. Note l'ID de ta base (dans l'URL : `airtable.com/appXXXXXXXXXX`)
