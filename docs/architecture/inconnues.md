# Inconnues, constats et recommandations

[Sommaire](README.md)

## Synthèse non technique

Le dépôt contient plusieurs projets aux niveaux de maturité différents : certaines pages présentent seulement une démonstration, d'autres enregistrent des données partagées ou transmettent une demande à un prestataire. L'hébergement des pages, la base de données et la messagerie sont des services distincts. Une mise à jour du site n'installe pas automatiquement les tables ou fonctions serveur. Les principales zones à compléter sont la cartographie des comptes fournisseurs, le schéma réel de la base et les sauvegardes.

## Constats sur l'existant

| Priorité | Constat et preuve | Impact / limite |
|---|---|---|
| Haute | Mot de passe admin fixe en clair dans les sources Albert ; README et admin.sql | Risque d'accès aux souvenirs et références si les RPC sont installés et joignables. Valeur non recopiée ; exposition distante actuelle à vérifier |
| Haute | Code familial par défaut publié, confirmé dans config.js et read-access.sql | Modèle de famille de confiance, sans authentification individuelle ; profil choisi ne protège pas contre l'usurpation |
| Haute | Même URL Supabase dans Facture, Voitures et Albert ; CI copie ces fichiers vers staging | Couplage des données, Auth et quotas ; staging peut viser les données partagées |
| Haute | DDL initial companies/clients/documents/document_lines/payment_reminders absent | Recréation complète et revue exhaustive des contraintes impossibles depuis ce dépôt seul |
| Haute | Empreintes différentes entre local et public pour Facture/app.js, Archive/stream.js et BD/albert/app.js ; verification-externe.json | Le comportement local décrit ne certifie pas celui du déploiement public ; comparer les versions avant maintenance |
| Haute | Workflow de staging copie très largement le dépôt ; exclusions limitées | SQL, documentation ou fichiers de travail versionnés peuvent se retrouver sur l'artefact public ; confidentialité et taille à revoir |
| Moyenne | Des démos affichent un succès sans requête : Chauffagiste3 handleSubmit, Chauffagiste2 et Puériculture1 onsubmit, Coiffeur, contact/estimation AutoPrime | Un visiteur pourrait croire avoir réservé ou envoyé une demande ; vérifier leur présentation publique |
| Moyenne | puériculture2/index.html commence par ZIP/Office et contient des entrées ppt/ | Ce n'est pas un document HTML exploitable ; statut et origine du fichier à clarifier |
| Moyenne | Résolution TXT de _dmarc.orbytek.be : ENOTFOUND au contrôle public | Pas de politique DMARC retrouvée à cette date ; vérifier la zone de messagerie et la stratégie voulue |
| Moyenne | LISEZ-MOI Facture comporte d'anciennes limites contredites par save_document_v2 et le module Peppol | Risque de mauvaise procédure ; cette documentation distingue code actuel et mentions historiques |
| Moyenne | Backend contact Supabase/Resend présent mais contact.js appelle Web3Forms | Risque de configurer ou surveiller le mauvais circuit ; coûts et maintenance inutiles possibles |
| Moyenne | Versions CDN de supabase-js parfois sur majeure @2, autres imports épinglés | Reproductibilité différente selon application ; dépendance réseau à contrôler |
| Moyenne | DDL SQL évolutif, migrations Peppol avec ordre explicite non évident par tri des noms | Application automatique ou répétition peut échouer ou changer un objet déjà installé |
| Moyenne | Nettoyage automobile déclenché uniquement par admin | Fichiers abandonnés restent stockés sans nouvelle visite admin |
| Moyenne | Filmthibaut / Archive sans authentification ; liseuse avec mot de passe partagé et déchiffrement navigateur | Les vidéos dépendent d'une éventuelle protection d'hébergement ; fichiers chiffrés récupérables pour essais hors ligne |
| À qualifier | Publication Archive historique proche de 948 Mo pour le site ; rapport local | Budget média et temps de publication à mesurer actuellement ; pas un constat de quota dépassé |
| À qualifier | Sauvegardes, rétention, région et supervision non vérifiées | Disponibilité et capacité de restauration inconnues ; absence de preuve ne signifie pas absence de sauvegarde fournisseur |

Les priorités qualifient les vérifications et conséquences possibles, pas une certification de vulnérabilité distante. Aucun test d'intrusion ou accès aux souvenirs n'a été réalisé.

Les questions d'hébergement et DNS ont été partiellement résolues : GitHub sert les pages, OVH fournit les NS et les MX, le SPF est lisible et TLS est valide. Le tableau ci-dessous porte sur les paramètres de compte, le registrar et les points qui ne se déduisent pas de ces sondes. Les résultats détaillés sont dans [preuves](preuves/README.md).

## Questions à résoudre

| Priorité | Information manquante | Comment la vérifier / accès requis |
|---|---|---|
| P1 | Qui gère le domaine, son renouvellement et les accès de secours ? | Compte registrar, facturation et propriétaire ; DNS publics seuls insuffisants |
| P1 | Qui héberge effectivement orbytek.be et test.orbytek.be aujourd'hui ? Quelle branche et quel dossier ? | GitHub Settings > Pages, dernier déploiement et console éventuelle d'un autre hébergeur |
| P1 | Quelle région, quel nom, quel plan et quels environnements Supabase ? | Console du projet dpwmxzptfgmkjecpuikb ; aucune région déduite de l'URL |
| P1 | Quelles tables, colonnes, contraintes, policies et RPC sont réellement installées ? | Export de schéma sans données/secrets, pg_catalog et historique de migrations |
| P1 | Quelles sauvegardes PostgreSQL/Storage existent et une restauration a-t-elle été testée ? | Paramètres backup/PITR, export des objets, procès-verbal de restauration ; définir RPO/RTO |
| P1 | Les références privées Albert et l'admin sont-elles accessibles selon le niveau de confidentialité souhaité ? | Examiner droits et API distante avec accès autorisé, puis revoir les secrets déjà présents dans l'historique |
| P1 | Quels dossiers doivent être publics et lesquels doivent rester hors déploiement ? | Liste de publication validée : travail anniversaire, exports, scripts, rapports et documentation compris |
| P2 | Les formulaires Web3Forms et FormSubmit livrent-ils actuellement les notifications attendues ? | Dashboard et boîte destinataire ; test explicite ultérieur nécessaire, aucun envoi effectué ici |
| P2 | Le backend alternatif contact / cron est-il installé, utile ou abandonné ? | Supabase Functions, tables, cron.job et Vault ; ne communiquer aucune valeur secrète |
| P2 | Quel mode Recommand est activé, pour quelles sociétés, et quel cycle réel est validé ? | Console Recommand + statut du module : envoi/réception/signature/archivage/avoir en playground |
| P2 | Les règles DNS, HTTPS, MX, SPF, DMARC et DKIM sont-elles conformes à l'usage actuel ? | Zone DNS, certificat, sélecteurs DKIM et en-têtes d'un message reçu |
| P2 | Quelle configuration Microsoft SPA est prévue pour le module Outlook ? | App registration et redirect URI ; code présent mais circuit actif .eml |
| P2 | Puériculture2 doit-il être un site, une présentation ou un fichier mal nommé ? | Retrouver l'original ; ne pas convertir silencieusement ce fichier |
| P3 | Quels responsables surveillent les erreurs, coûts, quotas et expirations ? | Comptes fournisseurs, alertes, journal d'exploitation |
| P3 | Les exports demos correspondent-ils aux dernières sources premium ? | Build/export reproductible isolé et comparaison contrôlée ; cet audit n'a pas réécrit les exports |
| P3 | Quels délais de conservation et suppression pour contacts, souvenirs, photos et événements ? | Décision du propriétaire et configuration des fournisseurs ; règles SQL de purge existantes limitées aux quotas contact |

## Recommandations distinctes de l'existant

1. Obtenir un export de schéma distant sans données, comparer aux SQL et compléter le DDL initial manquant ; ne pas lancer un reset de la base existante.
2. Établir un registre des comptes/domaines/propriétaires, des environnements et des sauvegardes. Vérifier une restauration PostgreSQL et Storage ensemble.
3. Remplacer les secrets admin codés en dur et préciser le modèle d'accès aux données familiales ; prévoir une rotation tenant compte de l'historique Git et des fichiers publiés.
4. Sélectionner explicitement les artefacts publics au lieu d'une copie générale et séparer les données de test des données métier si nécessaire.
5. Maintenir une seule description du circuit actif par formulaire, afficher clairement les simulations, et vérifier la réception réelle après publication autorisée.
6. Ajouter au cycle de livraison les vérifications adaptées : tests existants, build/export premium et contrôles des migrations manquantes. Ne pas confondre les suites simulées avec un cycle fournisseur réel.
7. Définir surveillance des erreurs, nettoyage, coûts médias et politiques de rétention, puis associer chaque tâche à un responsable.

Aucune de ces recommandations n'a modifié le code ou les services pendant la rédaction.
