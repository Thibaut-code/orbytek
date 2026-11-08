# Architecture du projet Orbytek

Analyse du **4 novembre 2026** (Europe/Brussels). Dépôt local `projet2`, branche **develop**, commit **8d566b037aa608846502e0342b646cccb6838a18**. Arbre Git propre au début de l'analyse. Les seuls ajouts de cet audit sont dans ce dossier ; aucun déploiement, changement métier, écriture de base ou envoi de formulaire n'a été effectué.

## Lecture rapide

Orbytek est un ensemble de sites statiques, de démonstrations et d'applications métier et familiales. Le navigateur assure une grande part des traitements. Facture Facile, AutoPrime et le questionnaire familial référencent **le même projet Supabase** ; leurs données ont des règles d'accès différentes. Le formulaire commercial de la racine utilise **Web3Forms**. Celui de Chauffagiste utilise **FormSubmit.io**. Les intégrations Resend présentes dans le dépôt constituent d'autres circuits, dont le raccordement doit être vérifié séparément.

## Sommaire

| Document | Contenu |
|---|---|
| [Vue d'ensemble](vue-ensemble.md) | Contexte, composants, technologies, responsabilités et schémas |
| [Inventaire technique](inventaire.md) | Dossiers, pages, dépendances et fichiers structurants |
| [Bases de données](donnees.md) | Modèle, frontières de sécurité, stockage et sauvegardes |
| [Dictionnaire SQL](dictionnaire-sql.md) | Colonnes, contraintes, index, évolutions et catalogue de fonctions présents dans les SQL |
| [Infrastructure et domaines](infrastructure.md) | Hébergement, DNS, HTTPS et CI/CD |
| [Formulaires et flux](flux.md) | Parcours, validations, destinations, séquences et notifications |
| [Configuration et exploitation](exploitation.md) | Variables, démarrage, déploiement et diagnostic |
| [Risques et inconnues](inconnues.md) | Preuves, questions et recommandations distinctes de l'existant |
| [Vérifications publiques](preuves/verification-externe.json) | Résultats HTTP, DNS et GitHub, ou erreurs d'accès |
| [Lecture des vérifications](preuves/README.md) | Résumé des résultats actuels, certificats et différences local/public |

## Fiches applicatives

- [Site vitrine Orbytek](applications/orbytek.md)
- [Facture Facile](applications/facture.md)
- [AutoPrime / Voitures](applications/voitures.md)
- [Questionnaire et administration Albert](applications/albert.md)
- [Liseuse BD Albert](applications/liseuse.md)
- [Films de Thibaut](applications/filmthibaut.md) et [Archive HLS](applications/archive.md)
- [Collection premium : sources et API](applications/premium.md)
- [Aurelia immobilier](applications/immobilier.md), [Maison Braise](applications/restaurant.md), [Vert & Pierre](applications/paysagiste.md)
- [Chauffagiste](applications/chauffagiste.md), [Chauffagiste2](applications/chauffagiste2.md), [Chauffagiste3](applications/chauffagiste3.md)
- [Coiffeur](applications/coiffeur.md), [Atelier rendez-vous](applications/rendezvous.md)
- [Puériculture1](applications/puericulture1.md), [Puériculture2](applications/puericulture2.md)
- [La Laguna](applications/la-laguna.md)
- [Atelier de création anniversaire](applications/anniversaire.md)

## Niveau de preuve et périmètre

**Vérifié dans le dépôt** signifie que le comportement ou la configuration a été lu dans les fichiers du commit analysé. **Historique déclaré** désigne une assertion d'un README ou rapport antérieur, qui ne certifie pas l'état distant actuel. **Déduit** indique une interprétation. **À confirmer** indique une information inaccessible ou non démontrée.

Les liens de sources pointent vers le code du dépôt. Les noms de variables sont documentés sans valeur secrète. Les données personnelles des réponses, les sauvegardes privées et les valeurs des fichiers `.env` n'ont pas été exportées dans cette documentation. Le dictionnaire SQL décrit les scripts, pas une introspection de la base distante. Les tables historiques de Facture n'ont pas toutes leur DDL initial dans le dépôt : leurs champs connus sont décrits avec cette limite.

L'analyse couvre les composants applicatifs et les chaînes de préparation ; elle ne relit pas chaque fichier média, bundle Next généré ou dépendance tierce. Les tests métier n'ont pas été relancés pour cette rédaction. Les vérifications de livraison portent sur les liens, la couverture documentaire, l'absence de secrets copiés et les preuves publiques accessibles.

Les vérifications publiques ont finalement réussi avec l'accès réseau autorisé : DNS chez OVH, pages servies par GitHub, redirections HTTPS et certificats valides. En revanche, **Facture/app.js, Archive/stream.js et BD/albert/app.js diffèrent entre le dépôt local et le site public**. Les fiches décrivent le commit local ; leur présence en ligne et ces comparaisons partielles ne certifient pas tous les comportements de production. Aucun accès authentifié aux consoles ni introspection SQL distante n'a été réalisé.

Livraison : **30 documents Markdown**, dont **20 fiches applicatives**, **21 définitions de tables SQL disponibles**, six tables historiques décrites avec leurs limites et **12 schémas Mermaid**. Le [rapport de vérification documentaire](preuves/verification-documentation.json) consigne le contrôle des liens locaux et des blocs de code. Les outils de régénération et de vérification sont dans `outils/` ; ils n'exécutent pas les migrations.

Pour actualiser : relever le nouveau commit, comparer le code et les migrations, refaire les vérifications publiques avec `node docs/architecture/outils/verifier-externe.mjs`, mettre à jour les fiches puis les questions ouvertes. Une réussite HTTP ne démontre ni la réception des e-mails, ni les droits SQL, ni le fonctionnement de tous les parcours.
