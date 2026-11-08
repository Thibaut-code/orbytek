# Maison Braise — restaurant

[Sommaire](../README.md) · [Socle et commandes](premium.md)

**Route :** `/demos/restaurant/`. Sources : [app/restaurant/page.tsx](../../../premium-sites/app/restaurant/page.tsx), [components/restaurant.tsx](../../../premium-sites/components/restaurant.tsx), lib/data.ts et lib/logic.mjs. Export dans demos/restaurant ; frontend React pré-rendu, sans backend Next.

La carte se filtre par catégories et végétarien ; les vins ont leurs filtres, les allergènes sont affichés. Le panier calcule quantités et total côté client. Réservation, commande à emporter, événement privé, cadeau et contact préparent des demandes, via le composant partagé lorsque raccordé. Les horaires sont calculés pour Bruxelles ; le formulaire refuse les jours/horaires de fermeture codés (lundi et dimanche soir) et les créneaux passés.

Pas de table de réservation, stock, paiement bancaire ou émission de bon cadeau réel. Le fichier agenda est un rappel à confirmer. Un HTTP réussi du service leads signifie transmission de demande, pas disponibilité ou commande acceptée. Le carnet Instagram est éditorial et les cartes externes se chargent à la demande.

Catalogues et marques fictifs, aucun compte visiteur. État de panier local au client ; pas de notifications automatiques hors l'API optionnelle. Les erreurs de formulaire passent par LeadForm. Développement/tests/export/configuration : [Premium](premium.md). La Laguna est une [maquette distincte](la-laguna.md), pas le restaurant de cette route.
