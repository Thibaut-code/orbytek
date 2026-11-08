# Archive — lecteur HLS publié

[Sommaire](../README.md) · [Chaîne de préparation](filmthibaut.md)

**Entrée :** [Archive/index.html](../../../Archive/index.html). app.js/chapters.js pilotent la navigation, pellicule.css le rendu, hls.min.js et [stream.js](../../../Archive/stream.js) la lecture de `media-web/film.m3u8`. Les médias sont découpés en init.mp4 et segments .m4s ; la publication ne repose pas sur le téléchargement intégral d'un MP4 de plusieurs Go.

Le navigateur utilise hls.js si Media Source Extensions est pris en charge, ou le HLS natif lorsque disponible. Le code limite les buffers (30/60 secondes, mémoire cible de 40 Mio), reprend jusqu'à trois erreurs réseau fatales et une erreur média, puis affiche une indisponibilité. Les chapitres et l'état d'édition sont locaux au navigateur, comme pour le lecteur source ; aucune table SQL.

Adresse historique de publication : `https://orbytek.be/Archive/`. Les rapports [publication-verification.json](../../../filmthibaut/analysis/publication-verification.json) et publication-commit.json déclarent un build et des réponses 200 sur la page et quelques médias. Ils ne remplacent pas une lecture intégrale actuelle ni un contrôle d'accès.

Le contrôle du 4 novembre confirme HTTP 200 pour la page publique ; stream.js diffère toutefois du fichier local par son empreinte. Les paramètres décrits ci-dessus sont ceux du dépôt, pas une lecture certifiée du script de production.

Pas d'authentification applicative repérée. Le chiffrement de la liseuse BD ne protège pas ces vidéos. Les fichiers MIME et chemins relatifs de playlist/segments doivent être servis correctement ; voir [diagnostic](../exploitation.md). Consulter via serveur HTTP statique ; aucune installation ou compilation requise pour les fichiers déjà préparés. Les outils d'encodage et publication sont dans filmthibaut, pas dans le lecteur.
