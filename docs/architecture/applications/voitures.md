# AutoPrime — catalogue et administration

[Sommaire](../README.md) · [Schéma et stockage](../donnees.md) · [Séquence photos](../flux.md#autoprime--photos-et-catalogue)

**Dossier réel :** `Voitures/`, avec majuscule. [index.html](../../../Voitures/index.html) est public ; [admin.html](../../../Voitures/admin.html) contient connexion et édition du stock. Le README cite aussi `/voiture/` au singulier : aucune réécriture correspondante n'est attestée dans le dépôt. Préserver la casse sur hébergement statique.

Contrôle public du 4 novembre : `/Voitures/` répond 200, `/voiture/` répond 404. Le fichier public data.js a la même empreinte que le fichier local ; les droits et données distants n'ont pas été testés.

[data.js](../../../Voitures/data.js) accède à Supabase et porte les opérations de catalogue ; script.js rend les filtres, cartes et formulaires publics ; gallery.js ouvre les photos. admin.js gère session, autorisation et sauvegarde ; photos.js transforme les images. Le frontend charge supabase-js 2.110.2 depuis jsDelivr et les paramètres publics de supabase-config.js.

Le catalogue utilise la table `voitures`, par lots de 12 et filtres serveur. Les visiteurs lisent le stock ; seuls les utilisateurs Supabase Auth inscrits dans `vehicle_admins` peuvent le modifier. Créer un compte Auth seul ne suffit pas. Aucune inscription publique de gestionnaire ni attribution d'administrateur côté navigateur.

`vehicle_photo_cleanup` et les triggers assurent le suivi des fichiers. Les photos sont compressées WebP et stockées dans le bucket public `vehicle-photos`, avec miniatures. Les chemins uniques et les dimensions sont contrôlés en base ; les règles Storage refusent MIME/taille incorrects et les suppressions de photos utilisées. Le nettoyage s'effectue dans l'administration, jusqu'à 100 fichiers éligibles, sans tâche serveur automatique repérée. Le détail est dans [Voitures/README.md](../../../Voitures/README.md) et [setup.sql](../../../Voitures/supabase/setup.sql).

Les formulaires publics `estimForm` et `contactForm` simulent une confirmation. Ils ne créent ni lead Supabase ni e-mail dans le code actuel. Ne pas assimiler le catalogue persistant à un contact opérationnel.

Aucun build requis pour publier HTML/JS/CSS et médias. Depuis Voitures : `npm ci`, `npm test`, `npm run preview`. Les tests utilisent notamment PostgreSQL embarqué PGlite et un SDK simulé ; le serveur de test expose des routes de simulation qui ne sont pas des endpoints métier de production. Configuration, migration réelle et droits doivent être contrôlés dans Supabase avant usage. Les erreurs d'upload ou de sauvegarde restent visibles dans l'admin et la file permet une reprise de nettoyage.
