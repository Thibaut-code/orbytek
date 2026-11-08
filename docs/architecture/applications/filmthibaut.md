# Films de Thibaut — sources et préparation

[Sommaire](../README.md) · [Publication Archive](archive.md)

**Dossier :** filmthibaut. [index.html](../../../filmthibaut/index.html), app.js, chapters.js et pellicule.css forment un lecteur natif de film familial. Le HTML vise la version MP4 nettoyée v3 ; [README.md](../../../filmthibaut/README.md) conserve des descriptions de versions précédentes.

App.js affiche le film et les chapitres, filtre par année, navigue par vignette et permet l'édition/import/export des repères. Les modifications de chapitres restent dans localStorage `orbytek-thibaut-chapters-v1`. Le fichier chapters.js sert de valeur publiée initiale ; remplacer ce fichier par un export change la version partagée après publication, pas la seule sauvegarde locale.

Les scripts Python couvrent l'analyse, les vignettes, la normalisation audio, la réduction du bruit, l'encodage compact, la préparation et la vérification de publication. Ils s'appuient notamment sur FFmpeg/ffprobe ; les rapports dans analysis/ sont les preuves historiques des traitements. Les anciennes versions de médias sont conservées dans le dossier de travail. Il n'y a pas de base SQL ni de traitement serveur métier pour la lecture.

`node server.cjs` depuis filmthibaut sert l'aperçu sur 127.0.0.1:8080 avec support HTTP Range. Ne pas confondre ce serveur de prévisualisation et l'hébergement public. La chaîne `prepare_archive.py`, `compact_archive.py`, `publish_archive.py`, `verify_publication.py` prépare/publie la variante HLS sous Archive ; le script publish_archive effectue un push réel s'il est exécuté.

Le lecteur source ne comporte pas d'authentification. Le film familial et ses vignettes deviennent accessibles à toute personne autorisée par l'hébergement, s'il n'existe pas de contrôle externe. Les erreurs de stockage local invitent à exporter les chapitres. Aucune diffusion ou réencodage n'a été effectué pendant cette documentation.
