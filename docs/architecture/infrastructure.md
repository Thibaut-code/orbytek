# Infrastructure, domaines et déploiements

[Sommaire](README.md) · [Preuves publiques brutes](preuves/verification-externe.json)

## État prouvé et déclaré

| Composant | Environnement | Fournisseur | Service/projet | Région | URL/domaine | Source de vérification |
|---|---|---|---|---|---|---|
| Site et sous-applications statiques | Production déclarée | GitHub Pages selon documentation et rapports historiques | remote `Thibaut-code/orbytek` ; branche de publication actuelle à confirmer | Non identifiée | orbytek.be | CNAME, README applicatifs, rapport Archive |
| Copie du dépôt | Test prévu par workflow | GitHub Actions puis hébergement à confirmer | Thibaut-code/orbytek-staging, branche main | Runner ubuntu-latest ; région non fixée | test.orbytek.be | .github/workflows/deploy-staging.yml |
| Base / Auth / Storage | Cloud configuré par trois frontends | Supabase | dpwmxzptfgmkjecpuikb | À confirmer dans console | dpwmxzptfgmkjecpuikb.supabase.co | Configurations Facture, Voitures et Albert |
| Fonctions Peppol | Cloud, déploiement historiquement déclaré | Supabase Edge Functions | peppol, peppol-webhook, invoice-integrations | À confirmer | /functions/v1/... | Sources et PEPPOL.md |
| Contact commercial actuel | Service externe | Web3Forms | Formulaire référencé par clé publique | Non identifiée | api.web3forms.com/submit | contact.js, CONTACT-SETUP.md |
| Devis Chauffagiste actuel | Service externe | FormSubmit.io | Formulaire référencé par action HTML | Non identifiée | formsubmit.io/f/... | Chauffagiste/index.html, FORMULAIRE.md |
| Contact alternatif | Déploiement non prouvé | Supabase + Resend + Turnstile | orbytek-contact, worker, webhook | Non identifiée | /functions/v1/orbytek-contact* | Sources uniquement ; frontend racine non raccordé |
| Leads premium | Facultatif, local préparé | Node + Resend ; hôte cloud inconnu | server/lead-api.mjs | Non définie | 127.0.0.1:8787/leads par défaut | API et .env.example premium |
| Échanges Peppol | Playground ou production selon secret serveur | Recommand | Compte/entreprise associés côté serveur | Non identifiée | app.recommand.eu/api/v1 | _shared/peppol-service.ts |
| Messagerie destinataire | Historique déclaré | OVH selon CONTACT-SETUP.md | Compte de destination Orbytek | Non identifiée | Domaine de messagerie orbytek.be | Guide contact, configuration DNS actuelle à confirmer |

Un CNAME présent dans Git n'active pas à lui seul un domaine. Les résultats de sondes publiques, y compris les échecs réseau, sont dans [verification-externe.json](preuves/verification-externe.json). Aucun accès authentifié aux consoles GitHub, Supabase, OVH, Web3Forms ou FormSubmit n'a été établi pendant cet audit. Les assertions de mise en service datées dans les guides sont conservées comme historique, pas comme nouvelle validation.

### Vérifications publiques du 4 novembre 2026, vers 21 h 52–21 h 54 à Bruxelles

La reprise des sondes avec l'accès réseau autorisé a permis de vérifier :

- **Hébergement web :** racine orbytek.be et test.orbytek.be répondent HTTP 200 avec `Server: GitHub.com`. Les A de l'apex sont 185.199.108.153, .109.153, .110.153 et .111.153 ; www et test sont des CNAME vers `thibaut-code.github.io`. L'ensemble concorde avec GitHub Pages. Les réglages internes du dépôt et la branche effective restent non lus.
- **DNS :** `dns111.ovh.net` et `ns111.ovh.net` sont les NS autoritaires retournés. Cela établit la gestion DNS par l'infrastructure OVH, pas le registrar ni le titulaire.
- **Mail :** MX vers mx1.mail.ovh.net (priorité 1), mx2 (5), mx3 (100). SPF publié : `v=spf1 include:mx.ovh.com -all`. Aucune réponse TXT DMARC trouvée sur `_dmarc.orbytek.be` lors de cette résolution (ENOTFOUND). DKIM reste inconnu faute de sélecteur.
- **Redirections :** HTTP apex → HTTPS apex en 301 ; HTTPS www → HTTPS apex en 301. La racine HTTPS renvoie un cache `max-age=600` ; aucun HSTS retourné dans ces réponses HEAD.
- **TLS :** certificats validés par le client, émis par Let's Encrypt (YR1). Apex/www : expiration le 29 décembre 2026 à 13:17:32 UTC. Test : le 11 janvier 2027 à 19:59:32 UTC. Le renouvellement automatique et son responsable ne sont pas établis par cette observation.
- **Version publique :** trois scripts comparés sont identiques (contact.js, Voitures/data.js, albert_65ans/app.js), trois diffèrent (Facture/app.js, Archive/stream.js, BD/albert/app.js). Il faut comparer ces versions avant de considérer la documentation locale comme photographie exacte de la production.
- **API GitHub Pages :** les deux lectures anonymes retournent 404 ; cela ne démontre ni l'absence du dépôt ni l'absence de Pages. Les paramètres internes nécessitent un accès autorisé.

Voir [le tableau de présence des applications et les empreintes](preuves/README.md). Un 200 vérifie la présence d'une réponse, pas le fonctionnement du formulaire ou des droits métier. Aucune soumission n'a été faite.

## Pipeline de test

Source exacte : [deploy-staging.yml](../../.github/workflows/deploy-staging.yml).

1. Un push sur `develop`, ou un lancement manuel, déclenche le job Ubuntu.
2. Checkout du dépôt avec `persist-credentials: false`.
3. Le secret GitHub `STAGING_DEPLOY_TOKEN` sert à cloner `orbytek-staging` branche `main` puis à pousser.
4. `rsync -a --delete` recopie le dépôt. Exclusions : `.git/`, `.github/`, `.gitignore`, `CNAME`, `node_modules/`, `.env*`.
5. Le job crée `.nojekyll`, remplace CNAME par `test.orbytek.be`, puis remplace robots.txt par `Disallow: /`.
6. Un commit n'est créé que si le contenu change. Le groupe de concurrence `orbytek-staging` annule les exécutions précédentes.

Le workflow **n'exécute ni tests, ni build Next, ni export, ni migration SQL, ni déploiement de fonctions**. Les fichiers de `demos/` doivent donc déjà être générés et versionnés. Le push vers le dépôt de staging est démontré par le script ; la configuration Pages qui doit le servir reste à vérifier dans GitHub.

Les exclusions `.env*` évitent de copier les secrets sous cette forme. Elles ne constituent pas une sélection de fichiers publics : les SQL, scripts, README, sources de travail et futurs `docs/` peuvent être copiés lorsqu'ils sont versionnés. `robots.txt` ne protège pas l'accès aux fichiers. Les configurations Supabase publiques étant communes, un test sur staging pourrait écrire dans les mêmes données métier si l'utilisateur s'y connecte.

## Production et médias

Le remote local est `https://github.com/thibaut-code/orbytek.git`. La branche analysée est develop ; aucun push ni changement de branche n'a été fait. Aucun workflow de production n'est présent dans `.github/workflows` à ce commit.

[filmthibaut/publish_archive.py](../../filmthibaut/publish_archive.py) prépare une publication ciblée dans un autre checkout, vérifie la playlist complète, les segments et un budget de taille, puis pousse sur `main`. C'est un outil de publication avec effets distants, **non exécuté** pour cet audit. Les rapports [publication-commit.json](../../filmthibaut/analysis/publication-commit.json) et [publication-verification.json](../../filmthibaut/analysis/publication-verification.json) déclarent le commit `0f4d6f61a32b3401b51fbae853b5f4376f020661`, état `built`, et des réponses 200 pour la page Archive et quelques médias. Le rapport de taille contient environ 790 Mo d'archive et 948 Mo pour le site au moment de cette publication ; ce n'est pas une mesure distante actuelle.

Pas de reverse proxy personnalisé, conteneur Docker ou cluster Kubernetes identifié dans les fichiers structurants examinés. Le service leads premium écoute seulement sur loopback et requiert un raccordement HTTPS externe pour être exposé. Les serveurs Node locaux sont des outils de prévisualisation ; ils ne prouvent aucun hébergement de production.

## Domaine, DNS et certificats

| Élément | Preuve locale | Conclusion permise |
|---|---|---|
| Domaine principal | [CNAME](../../CNAME) = orbytek.be | Domaine voulu pour le site |
| Domaine test | CNAME généré par CI | test.orbytek.be voulu pour la copie de test |
| www | CORS, métadonnées et liens dans les sources | Variante attendue ; redirection et DNS non prouvés par cela |
| Canonical | index et pages SEO, sitemap.xml | Canonical éditorial vers le site principal ; pas une redirection serveur |
| /BD/albert/ | [404.html](../../404.html) | Correction de variantes de casse via JavaScript ; réponse HTTP initiale potentiellement 404 |
| Registrar / titulaire / renouvellement | Aucun contrat ou accès fournisseur vérifié | À demander au propriétaire ou vérifier dans le compte registrar |
| Zone DNS / A / AAAA / CNAME / NS | Sondes publiques dans le JSON | À lire selon résultat et date ; un NS n'identifie pas nécessairement le registrar |
| MX / SPF / DMARC | Sondes MX/TXT et _dmarc | Configuration effective à confirmer si sondes en erreur |
| DKIM | Sélecteur absent des sources | Impossible de vérifier sans sélecteur ou en-tête d'un e-mail signé |
| Certificats et renouvellement | URLs HTTPS utilisées | Console hébergeur et certificat TLS à vérifier ; automatisation non attestée |

La boîte OVH mentionnée dans le guide contact ne prouve pas que le domaine y est enregistré, que le DNS y est géré, ni que le site y est hébergé. Un succès HTTPS démontre un accès TLS à cet instant ; il ne donne pas le responsable du renouvellement.

## Observabilité, cache et retour arrière

Les sources proposent des erreurs d'interface, des tables d'événements Peppol et contact, et des rapports de tests locaux. Aucun dispositif centralisé d'alerte d'incident, SLO ou astreinte n'est configuré dans les éléments examinés. Les logs GitHub Actions, Supabase Functions et fournisseurs sont les points de contrôle à ouvrir dans leurs consoles ; leurs rétentions restent inconnues.

Photos automobiles : noms uniques et `cacheControl` d'un an ; un changement produit une nouvelle URL. Liseuse : fichiers chiffrés chargés avec `no-store`. Serveur local premium : `no-cache`, gzip pour les textes, aucun service de CDN configuré par ce serveur. Le CDN et cache réellement appliqués au domaine public doivent être vérifiés sur l'hébergeur.

Retour arrière statique : Git permet de restaurer une version, mais aucune procédure de rollback production n'est automatisée dans ce dépôt. Un retour de fichiers frontend ne restaure pas les bases, objets Storage ou échanges Peppol déjà effectués. Les migrations n'ont pas de scripts descendants complets. Aucun rollback n'a été exécuté.
