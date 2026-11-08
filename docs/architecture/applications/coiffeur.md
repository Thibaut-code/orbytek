# Coiffeur — réservation simulée

[Sommaire](../README.md)

**Entrée :** [Coiffeur/index.html](../../../Coiffeur/index.html), style.css et [script.js](../../../Coiffeur/script.js). Site statique avec services, galerie, étapes de réservation et newsletter. Les interactions sont réalisées dans le navigateur, sans build ni backend identifié.

Le formulaire reservationForm demande prestation, date/heure, prénom, nom, e-mail et téléphone. Le JS vérifie la présence des coordonnées et une forme simplifiée de l'e-mail, compose un récapitulatif puis ouvre une modal et réinitialise le formulaire. Il n'écrit pas dans une base d'agenda et n'envoie pas d'e-mail. La newsletter donne un retour d'interface sans intégration serveur repérée.

Les disponibilités affichées ne constituent pas un agenda partagé. Pas de compte, rôle, paiement, notification serveur ou contrôle de conflit interutilisateur. Les erreurs de validation sont insérées dans l'étape active. Les coordonnées sont interpolées dans le récapitulatif côté client : une revue de sécurité serait nécessaire avant raccordement et utilisation publique réelle.

Servir `/Coiffeur/` avec le serveur commun. Aucun package ou suite de tests dédié trouvé. Ne pas confondre cette démo avec [Atelier rendez-vous](rendezvous.md), qui a son propre moteur de simulation et sa persistance locale.
