# Facture Facile

[Sommaire](../README.md) · [Données](../donnees.md) · [Flux](../flux.md) · [Configuration](../exploitation.md)

**Entrées :** [Facture/index.html](../../../Facture/index.html), [accueil.html](../../../Facture/accueil.html), `outlook-callback.html`. Application statique principalement pilotée par [app.js](../../../Facture/app.js). Pas de serveur Node de production propre ni de build à lancer pour le frontend.

Le contrôle public trouve `/Facture/` en HTTP 200, mais l'empreinte du app.js servi diffère du commit local. Cette fiche décrit donc le code local analysé ; les parcours en production doivent être rapprochés séparément.

## Structure et navigation

| Module | Responsabilité |
|---|---|
| app.js | Session, chargement métier, navigation, clients, documents, entreprise, PDF, envoi manuel, paiement et relances |
| team.js | Contexte de société, nom personnel, invitations et retrait d'accès |
| vat.js | Préparation TVA, achats, dates d'exigibilité et export de travail |
| interface.js / CSS et orbytek.css | Apparences et composants du tableau de bord |
| peppol.js / peppol.css | Tableau de bord, sorties, entrées, événements et activation Peppol |
| outlook-mail.js | Intégration MSAL/Graph préparée, contrôle de session et pièces jointes |
| vendor | QR local, html2pdf et MSAL avec licences conservées |
| supabase/migrations | Évolutions SQL ; base historique prérequise |
| supabase/functions | Traitements privilégiés, Recommand et contact alternatif |

Les vues métier sont rendues par JavaScript : accueil, clients, factures/devis, création/édition/aperçu, paiements, paramètres, entreprise, équipes et module `#peppol`. L'acceptation d'invitation utilise le fragment `#join/...`. Ce ne sont pas des endpoints HTTP serveur indépendants. Les fonctions `go`, `loadData`, `save_document_v2`, `sendDocument` et `confirmDocumentSend` sont des points de suivi utiles.

## Identité et droits

Supabase Auth gère l'inscription, la connexion, la déconnexion et la récupération. L'événement PASSWORD_RECOVERY bascule vers la définition du nouveau mot de passe ; Site URL et Redirect URLs sont à configurer dans Supabase cloud. Les modèles d'e-mails sont sous `emails/`, mais leur présence ne prouve pas qu'ils sont installés dans Auth.

`company_context` associe le membre à un responsable ; les données métier utilisent le responsable comme user_id. Employés et responsable partagent les données ; invitations et retrait d'accès sont réservés au responsable. Une personne n'a qu'une appartenance active. Les politiques SQL constituent la frontière réelle, indépendamment des boutons affichés.

## Sauvegarde et traitements

Le code appelle réellement la RPC `save_document_v2`, qui valide et sauvegarde document/lignes et numéro atomiquement avec verrou SQL, sous réserve que les migrations correspondantes soient installées. Les instantanés émetteur/client conservent l'historique d'un document. Les documents envoyés/payés/engagés sont protégés. `delete_unsent_invoice` et `documents.paid_at` sont utilisés dans app.js mais leur définition complète n'est pas fournie par les migrations présentes : à introspecter.

Les récurrences créent des brouillons depuis l'application, les relances préparent un e-mail ; aucun ordonnanceur de facturation/relance autonome n'est démontré. PDF et QR SEPA sont produits localement. La validation IBAN détermine si le QR peut être affiché. Les justificatifs TVA ne sont pas téléversés par le parcours décrit. Le CSV TVA est une préparation de contrôle, pas un dépôt automatique.

`sendDocument` prépare actuellement un fichier `.eml` avec PDF et attend une confirmation manuelle. Le module Graph chargé sait appeler `me/sendMail` avec Mail.Send, limite PDF à 3 Mo et traite les timeouts comme incertains ; le client Microsoft n'est pas activé valablement dans config.js et ce module n'est pas appelé par le parcours d'envoi consulté. Un statut d'envoi confirmé dans la base n'est pas une preuve de livraison.

## APIs serveur

Toutes les fonctions sont sous l'URL Supabase configurée, préfixe `/functions/v1/`.

| Fonction | Contrat et protection |
|---|---|
| invoice-integrations | action + documentId ; JWT, société, configuration serveur ; test historique de génération/validation Peppol, pas transmission réseau |
| peppol | JWT vérifié par auth.getUser ; actions status, activate, verify-company, receive, webhook, verify-recipient, sync, refresh, review, correct, download, send, credit |
| peppol-webhook | Signature X-Signature HMAC, rapprochement entreprise/équipe et déduplication du corps signé |
| orbytek-contact | Contact public alternatif, contrôle origine/Turnstile/quota ; indépendant des factures et du frontend racine actuel |
| orbytek-contact-worker | Bearer privé, traitement de file Resend |
| orbytek-contact-webhook | Signature Svix, événements de livraison Resend |

Le module Peppol choisit playground/production depuis les secrets serveur. Il archive XML/PDF, distingue génération et transmission, bloque le renvoi ambigu, permet les avoirs totaux et rapproche l'historique. [PEPPOL.md](../../../Facture/PEPPOL.md) déclare un déploiement et des migrations au 13 octobre ; le cycle complet réel et l'état cloud actuel ne sont pas certifiés par cet audit.

Erreurs : interface de toast/dialogue et erreurs Data API ; événements SQL pour Peppol ; erreurs fournisseur conservées pour diagnostic. Aucun système central d'alerte identifié. Paramètres : APP_CONFIG, secrets Recommand/Supabase et APP_ORIGIN, voir catalogue. Tests existants : depuis Facture, `node --test tests/*.test.cjs` ; previews et contrôles navigateur dans tests/. Aucun test live lancé pour rédiger cette fiche.

Les anciennes sections de [LISEZ-MOI.md](../../../Facture/LISEZ-MOI.md) décrivent encore une numérotation navigateur et l'absence de Peppol. Elles sont historiques et contredites par les migrations et modules actuels : ne pas s'en servir comme état final sans lecture du code.
