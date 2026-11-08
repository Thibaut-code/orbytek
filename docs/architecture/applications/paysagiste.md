# Vert & Pierre — paysagiste

[Sommaire](../README.md) · [Socle et commandes](premium.md)

**Route :** `/demos/paysagiste/`. Sources : [app/paysagiste/page.tsx](../../../premium-sites/app/paysagiste/page.tsx), [components/garden.tsx](../../../premium-sites/components/garden.tsx), garden-immersive.tsx/css, garden-breeze.tsx et lib/logic.mjs. Export consultable dans demos/paysagiste.

Le visiteur parcourt neuf services, filtre les réalisations, ouvre des fiches, utilise l'avant/après et un calculateur de budget. Le formulaire de projet en deux étapes adapte les informations à la prestation ; les demandes de conseil/contact utilisent le socle LeadForm. Les calculs sont illustratifs côté navigateur, sans moteur de devis serveur ni engagement commercial.

Sans endpoint compilé, aucune donnée du formulaire n'est transmise ; avec l'API optionnelle, un e-mail de demande peut être accepté par Resend, sans réservation automatique. Pas de base de chantiers, d'espace client ou de paiement. Les positions de communes sont schématiques ; les visuels avant/après sont des inspirations, pas la preuve d'un chantier réalisé.

État et calculs côté client, composants d'animation respectant la réduction des mouvements. Erreurs de saisie/envoi affichées localement, aucune table de journal propre. Les variantes et scripts de préparation conservés dans Facture/output/garden-upgrade sont des outils de travail, pas une application Facture supplémentaire. Build/test/export et paramètres : [Premium](premium.md).
