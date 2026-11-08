# Collection premium — socle commun

[Sommaire](../README.md) · [Immobilier](immobilier.md) · [Restaurant](restaurant.md) · [Paysagiste](paysagiste.md)

**Sources :** premium-sites. **Export servi :** demos. [package.json](../../../premium-sites/package.json) déclare Next 16, React 19, Tailwind 4, Framer Motion 12 et TypeScript. Les versions exactes verrouillées figurent dans [inventaire](../inventaire.md). Les fichiers générés sous demos/_next sont des artefacts, pas des sources à corriger manuellement.

[next.config.mjs](../../../premium-sites/next.config.mjs) fixe `output: export`, `basePath: /demos`, `trailingSlash: true`, images non optimisées par serveur Next. app/layout.tsx porte le cadre global ; app/page.tsx et les pages métier sont pré-rendues. components/shared.tsx rassemble navigation, dialogues, galerie, FAQ et LeadForm ; lib/data.ts fournit les catalogues et lib/logic.mjs les règles pures.

Aucun compte utilisateur, ORM ou base métier serveur dans ces démos. Les favoris et certains choix sont locaux, le panier et les simulations ne constituent ni commande ni réservation garantie. Les marques fictives et noindex sont indiqués dans les sources. Les services médias et cartes externes restent des dépendances de consultation.

LeadForm simule sans `NEXT_PUBLIC_REQUEST_ENDPOINT`. Avec cette variable au build, il transmet à une API séparée. [server/lead-api.mjs](../../../premium-sites/server/lead-api.mjs) fournit `POST /leads` et OPTIONS/CORS, contrôle JSON/origine/champs/consentement/honeypot/quota mémoire, puis appelle Resend. Sans les secrets d'envoi, il répond 503. Pas de persistance de leads dans cette API. Les règles et séquences sont dans [Flux](../flux.md#formulaires-premium-et-api-facultative).

Depuis premium-sites : `npm ci`, `npm run dev` (3000), `npm test`, `npm run build`, `npm run export`. L'export modifie demos et le portfolio racine ; l'API ne se déploie pas avec ces fichiers. `npm run serve` sert le dépôt entier sur 4173. Les scripts assets/videos/optimize-images préparent les médias ; les rapports Lighthouse existants décrivent leurs mesures locales à leur date. Aucun build ni audit Lighthouse n'a été relancé pendant la rédaction.

Le README comporte une feuille de raccordement client (catalogues, mentions, outils de réservation et paiement, cartographie). Il s'agit d'intégrations prévues. Pour l'exploitation et le déploiement effectifs, voir [Infrastructure](../infrastructure.md) et [Configuration](../exploitation.md).
