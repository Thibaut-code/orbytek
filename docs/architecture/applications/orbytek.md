# Site vitrine Orbytek

[Sommaire](../README.md) · [Flux contact](../flux.md#contact-orbytek-actif)

**Rôle :** présentation commerciale des services et portfolio. **Entrée :** [index.html](../../../index.html), à la racine du dépôt. HTML/CSS/JavaScript natif, sans build applicatif ni backend propre.

Pages principales : accueil, tarifs, créations, création de sites, applications sur mesure, intégrations/automatisations, support informatique, projet Facture Facile, mentions légales et merci. Les variantes `creation-preview-*` sont des aperçus, pas des services distincts. [sitemap.xml](../../../sitemap.xml) et [robots.txt](../../../robots.txt) décrivent l'indexation voulue.

[appearance.js](../../../appearance.js) et appearance.css gèrent l'apparence ; cosmos.js/css les effets visuels ; creations.js/css le portfolio ; tarifs.js la grille ; facture-project.js la présentation. Les métadonnées et le JSON-LD se trouvent dans les pages. Le serveur n'a pas de route API locale de contact : [contact.js](../../../contact.js) appelle Web3Forms. `merci.html` est une page de retour, pas une preuve de réception en boîte.

Aucun compte visiteur, rôle ou table propre au site vitrine repéré. Les demandes sont chez le prestataire, pas dans une table Supabase via ce frontend. [contact-config.js](../../../contact-config.js) contient uniquement l'activation et l'identifiant public du formulaire. Les coordonnées de contact et tarifs sont éditoriaux ; les mentions tarifaires ne sont pas recalculées par un système de facturation.

Hébergement voulu : domaine racine orbytek.be, avec copie de test via CI ; voir [Infrastructure](../infrastructure.md). Lancement : `node premium-sites/scripts/serve.mjs`. Vérification disponible : `node --test tests/contact-browser.test.mjs` et `python scripts/check-seo.py`. Les tests `contact.test.mjs` / `contact-sql.test.mjs` couvrent aussi le backend alternatif présent sous Facture ; ne pas en déduire qu'il reçoit le formulaire actuel. Configuration et diagnostic : [Exploitation](../exploitation.md).
