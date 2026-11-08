# Aurelia — immobilier

[Sommaire](../README.md) · [Socle et commandes](premium.md)

**Route :** `/demos/immobilier/`, détails `/demos/immobilier/biens/<id>/`. Sources : [app/immobilier/page.tsx](../../../premium-sites/app/immobilier/page.tsx), route dynamique `app/immobilier/biens/[id]/page.tsx`, [components/estate.tsx](../../../premium-sites/components/estate.tsx), property-detail.tsx et lib/data.ts. Les identifiants sont pré-rendus à la compilation, pas cherchés dans une base immobilière distante.

Le visiteur combine commune, prix, type, surface et chambres, ouvre un bien, parcourt sa galerie, ajoute des favoris locaux et compare jusqu'à trois biens. La carte est schématique ; les liens Maps ne démontrent pas une géolocalisation exacte. La visite 360° utilise Pannellum et un panorama d'exemple indépendant du bien.

Estimation, rendez-vous agence, visite et contact passent par LeadForm. Coordonnées, consentement, type de demande et champs propres à la visite/estimation sont validés dans le composant ; sans endpoint au build, aucune transmission. L'API facultative n'a pas d'agenda immobilier ni table de disponibilités : une demande doit être confirmée. Aucun paiement, authentification ou gestionnaire de biens serveur.

Les données, photos et contenus sont démonstratifs ; stockage local effaçable. Erreurs d'envoi affichées par le composant, pas de journal métier persistant côté démo. Configuration, tests et compilation partagés avec [Premium](premium.md). Export réel dans `demos/immobilier/` ; présence des exports ne certifie pas leur dernière publication distante.
