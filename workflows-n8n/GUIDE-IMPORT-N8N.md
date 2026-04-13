# Guide d'import workflows n8n — Nexus Claims Agent

## Les 6 workflows

| Fichier | Role | Trigger | Enchainement |
|---------|------|---------|-------------|
| `W1-recepteur-demandes.json` | Capte les nouvelles demandes | Outlook polling + Webhook ticketing | → W2 |
| `W2-analyseur-documentaire.json` | OCR + extraction avec Claude Vision | Webhook (depuis W1) | → W3 |
| `W3-verificateur-scoreur.json` | Scoring + decision | Webhook (depuis W2) | → W4 ou Attente ou Escalade |
| `W4-repondeur-automatique.json` | Personnalise + envoie l'email | Webhook (depuis W3) | Fin |
| `W5-reclamations.json` | Traite les reclamations | Outlook polling (filtre reclamation) | Notify gestionnaire |
| `W6-rapport-hebdomadaire.json` | Rapport KPI chaque lundi 8h | CRON lundi 8h | Email a Nathalie |

## Import dans n8n

1. Ouvre **n8n Cloud** (ou ton instance self-hosted)
2. Pour chaque fichier JSON :
   - Clique **"+"** (New Workflow)
   - Menu **"..."** en haut a droite → **"Import from File"**
   - Selectionne le fichier JSON
   - Le workflow apparait avec tous les nodes et connexions

## Credentials a configurer

Apres import, tu dois lier les credentials (les secrets ne sont jamais dans les JSON) :

### 1. Claude API Key
- Type : **Header Auth**
- Header Name : `x-api-key`
- Header Value : ta cle API Anthropic
- Utilise dans : W2, W3, W4, W5, W6

### 2. Airtable Token
- Type : **Airtable Personal Access Token**
- Token : depuis airtable.com → Developer Hub
- Utilise dans : W1, W2, W3, W4, W5, W6

### 3. Microsoft Outlook OAuth2
- Type : **Microsoft Outlook OAuth2**
- Client ID + Client Secret : depuis Azure AD app registration
- Scopes : Mail.Read, Mail.Send, Mail.ReadWrite
- Utilise dans : W1, W4, W5, W6

## Placeholders a remplacer

Dans chaque workflow JSON, remplace ces valeurs :

| Placeholder | Remplacer par |
|------------|--------------|
| `AIRTABLE_BASE_ID` | L'ID de ta base Airtable (appXXXXXXXXXXXX) |
| `DOSSIERS_TABLE_ID` | L'ID de la table Dossiers (tblXXXXXXXXXXXX) |
| `TEMPLATES_TABLE_ID` | L'ID de la table Templates Email |
| `CG_TABLE_ID` | L'ID de la table Conditions Generales |
| `HISTORIQUE_TABLE_ID` | L'ID de la table Historique Assures |
| `AIRTABLE_CRED_ID` | L'ID de ton credential Airtable dans n8n |
| `CLAUDE_CRED_ID` | L'ID de ton credential Claude API dans n8n |
| `OUTLOOK_CRED_ID` | L'ID de ton credential Outlook dans n8n |
| `nathalie@assur-connect.com` | L'email reel de Nathalie |

Pour trouver les IDs Airtable : ouvre ta base → l'URL contient `airtable.com/appXXX/tblXXX`

## Ordre d'activation

1. **W6** d'abord (rapport, pas de dependance)
2. **W5** ensuite (reclamations, standalone)
3. **W4** (repondeur, depend de W3)
4. **W3** (scoreur, depend de W2)
5. **W2** (analyseur, depend de W1)
6. **W1** en dernier (recepteur, lance tout)

## Test

Pour tester sans envoyer de vrais emails :
1. Desactive les nodes "Send Email Outlook" et "Mark Email Read"
2. Lance manuellement W1 avec des donnees de test via le webhook
3. Verifie que les dossiers sont crees dans Airtable avec le bon score
