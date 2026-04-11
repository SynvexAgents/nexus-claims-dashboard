import type { ChatMessage } from '../types'

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'c1',
    role: 'user',
    content: 'Pourquoi tu as escaladé le dossier REF-2026-04915 ?',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'c2',
    role: 'agent',
    content: `Le dossier REF-2026-04915 (Kévin Dupont) a reçu un score de **22/100** et a été escaladé pour les raisons suivantes :

**1. Document retouché** (impact -70 points — critique)
Le certificat médical présente des zones manifestement retouchées : la date semble avoir été modifiée, la police d'écriture est incohérente, et les coordonnées du médecin sont absentes.

**2. Incohérence motif** (impact -50 points — élevée)
Le motif déclaré est "blessure sportive récente", mais le certificat mentionne une "lombalgie chronique depuis 2024". Selon l'Article 3.2 des CG, les pathologies préexistantes à la souscription sont exclues.

**3. Pattern suspect** (impact -25 points — moyenne)
3 demandes de remboursement en 6 mois. L'assuré a déjà perçu 450 € de remboursements.

**Score détaillé :** 100 - 70 - 50 - 25 - 15 = **22** → escalade automatique.

**Action recommandée :** Vérifier si la lombalgie est préexistante. Contacter le médecin pour authentification du document.`,
    timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
  },
  {
    id: 'c3',
    role: 'user',
    content: 'Et s\'il fournit un nouveau certificat authentique daté du jour de l\'accident ?',
    timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
  },
  {
    id: 'c4',
    role: 'agent',
    content: `Si un nouveau certificat authentique confirme une blessure **survenue après la date de souscription**, voici l'impact :

- L'anomalie "document retouché" serait levée → **+70 points**
- L'anomalie "incohérence motif" serait levée si le diagnostic change → **+50 points**
- Le pattern comportemental resterait → **-25 points**

**Nouveau score estimé :** 100 - 25 = **75/100**

À 75, le dossier basculerait en **auto-validation**. Je sélectionnerais le template **ACC_BLE_007** (blessure dos) et j'enverrais la réponse automatiquement.

Souhaitez-vous que je repasse ce dossier en traitement avec le nouveau document ?`,
    timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
  },
  {
    id: 'c5',
    role: 'user',
    content: 'Combien de dossiers ont été escaladés cette semaine et pourquoi ?',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'c6',
    role: 'agent',
    content: `**4 dossiers escaladés cette semaine :**

| Ref | Assuré | Score | Raison principale |
|-----|--------|-------|-------------------|
| REF-2026-04915 | K. Dupont | 22 | Document retouché + incohérence |
| REF-2026-04916 | S. Lambert | 35 | Chronologie impossible (annulation avant souscription) |
| REF-2026-04917 | Y. Lefèvre | 15 | Document falsifié + pattern récurrent |
| REF-2026-04918 | N. Bonnet | 30 | Souscription J-1 + certificat postérieur |

**Patterns observés :**
- 2 dossiers impliquent des documents potentiellement falsifiés
- 1 dossier présente une chronologie impossible
- 1 dossier montre un pattern de souscription opportuniste

**Recommandation :** Les dossiers Dupont et Lefèvre présentent des signaux de fraude caractérisés. Je recommande une vérification approfondie et éventuellement un signalement.`,
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
  },
]
