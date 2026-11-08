# Questionnaire familial et administration Albert

[Sommaire](../README.md) · [Flux](../flux.md#questionnaire-familial) · [Données](../donnees.md)

**Entrées :** [albert_65ans/index.html](../../../albert_65ans/index.html), redirection historique questionnaire_albert_courtois.html, [admin.html](../../../albert_65ans/admin.html). Questionnaire natif statique, sans build. Sources : questionnaire-data.js (structure des 165 questions), core.js (règles et fusion), app.js (interface et synchronisation), admin-core.js/admin.js (regroupement, personnages, export et administration).

Le participant choisit un profil, ajoute éventuellement une personne puis raconte ses souvenirs, conversations et anecdotes. Il peut approuver une autre réponse ou apporter une précision. Les versions restent attribuées ; l'accord copie texte/note sans créer une synthèse automatique. Jusqu'à huit photos sont réduites par réponse/conversation.

Le choix de profil est déclaratif. Un code familial publié par défaut est envoyé aux RPC ; ce n'est pas un compte personnel. Les données privées sont dans `albert_private`, accessibles par fonctions publiques SECURITY DEFINER, sans droits de lecture directe aux rôles API. L'admin utilise un mot de passe fixe vérifié côté SQL ; sa valeur existante dans les sources n'est pas reproduite ici. Ce modèle et son exposition doivent être revus selon la confidentialité attendue.

RPC familiales : `albert_people`, `albert_add_person`, `albert_snapshot`, `albert_save`. RPC admin : `albert_admin_snapshot`, `albert_admin_remove_person`, `albert_admin_restore_person`, `albert_admin_save_character`, `albert_admin_delete_character`. Les écritures utilisent des révisions ; un conflit ne doit pas écraser silencieusement la version distante. Les personnes supprimées restent en base avec deleted_at et peuvent être restaurées. Les fiches personnages sont indépendantes des profils de participants.

Brouillons dans IndexedDB `AlbertCourtoisQuestionnaire`, préférences dans localStorage. Temporisation locale 180 ms, synchronisation périodique et au retour réseau/onglet. Fermer immédiatement la page ne garantit pas l'envoi ; le statut local/en ligne est déterminant. Les sauvegardes JSON, exports Markdown, photos téléchargées et références d'illustration sont privés et doivent rester hors de la publication.

Configuration : config.js et code côté settings ; migrations setup.sql, admin.sql, read-access.sql, et correctif admin-snapshot-timeout.sql. La fonction de snapshot admin a un timeout SQL ciblé de 15 secondes. Les scripts verify*.sql sont des vérifications, pas des migrations métier à répéter sans lecture.

Local : depuis albert_65ans, `node serve.cjs`, port 4189 ; `node --test tests/core.test.cjs tests/admin-core.test.cjs`. Les tests browser/family-access/admin-browser utilisent Playwright et backend simulé ; scripts live à examiner avant exécution. Adresse de publication déclarée : `https://orbytek.be/albert_65ans/`. Existence de fichiers et README ne certifie pas le schéma distant actuel.
