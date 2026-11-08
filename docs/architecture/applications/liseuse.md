# Liseuse de la BD Albert

[Sommaire](../README.md) · [Données](../donnees.md)

**Publication :** [BD/albert/index.html](../../../BD/albert/index.html), avec app.js, style.css, config.js et assets chiffrés. **Préparation :** anniversaire/site-bd-albert, prepare.py et encrypt.cjs ; copie de publication également présente dans ce dossier de travail. Le lecteur n'appelle ni base de données ni service d'authentification.

Le chemin public répond HTTP 200 au contrôle du 4 novembre ; app.js public diffère du fichier local par son empreinte. Les détails de cette fiche décrivent le commit local.

Le formulaire de mot de passe dérive une clé PBKDF2-SHA256 (600 000 itérations et sel public dans config.js), puis déchiffre le catalogue AES-256-GCM. Les fichiers .bin portent un nonce par fichier. Les images sont chargées/déchiffrées à la demande, rendues en Blob local et affichées en page unique ou défilement ; sommaire, zoom, plein écran et téléchargement du PDF sont intégrés.

Le mot de passe et la clé ne sont pas enregistrés dans les fichiers de publication. La progression seule est en localStorage (`albert-page`). Fermer l'album recharge la page et abandonne la clé en mémoire. HTTPS ou localhost est nécessaire à Web Crypto. Une erreur de déchiffrement affiche un message de mot de passe ; une ressource absente ou un contexte non sécurisé produit une erreur distincte.

[LISEZ-MOI.md](../../../anniversaire/site-bd-albert/LISEZ-MOI.md) décrit 51 pages issues de l'édition imprimeur et un PDF allégé. Les originaux sont des documents de travail distincts. La page 404 racine corrige certaines variantes de casse vers `/BD/albert/` par JavaScript. Ce n'est pas une redirection serveur universelle.

Cette protection autorise les essais de mot de passe hors ligne après téléchargement des .bin ; elle ne remplace pas une authentification serveur et les lecteurs autorisés peuvent exporter les contenus déchiffrés. Aucun limiteur serveur ni révocation individuelle de lecteur n'est identifié.

Pas de build pour lire. Pour régénérer, prepare.py nécessite Pillow, puis encrypt.cjs reçoit le mot de passe sur stdin ; lire les scripts avant exécution et publier un ensemble cohérent. Aucun de ces traitements n'a été lancé pour cet audit. Guide commun : [Exploitation](../exploitation.md).
