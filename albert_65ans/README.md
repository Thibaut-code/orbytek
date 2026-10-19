# La BD d’Albert — questionnaire familial

Adresse de publication : **https://orbytek.be/albert_65ans/**. Le fichier `questionnaire_albert_courtois.html` redirige vers cette adresse. La présence des fichiers locaux ne signifie pas qu’ils sont déjà publiés.

Le site statique utilise le projet Supabase existant d’Orbytek. Les réponses et photos sont dans le schéma isolé `albert_private`. Les tables de Facture Facile restent indépendantes.

## Activation

1. Dans le SQL Editor du projet `dpwmxzptfgmkjecpuikb`, exécuter `supabase/setup.sql`. L’exécution peut être répétée sans effacer les réponses ni changer le code. Le résultat donne le lien familial complet et le code.
2. Exécuter localement `_private/seed.sql` dans ce même SQL Editor pour conserver les souvenirs du questionnaire initial. Ce fichier contient des souvenirs personnels : il est ignoré par Git et ne doit pas être publié. L’insertion ne remplace aucune réponse existante.
3. Publier dans le dossier `albert_65ans` du site de production : `index.html`, `questionnaire_albert_courtois.html`, `style.css`, `config.js`, `questionnaire-data.js`, `core.js`, `app.js`.
4. Ouvrir le lien familial retourné par SQL sur deux appareils, choisir Maman et Jean-Paul, puis vérifier la sauvegarde et le partage. Le secret est transmis dans le fragment du lien et retiré de la barre d’adresse après ouverture. Il est mémorisé sur l’appareil pour les visites suivantes.

Les profils sont un choix d’identité dans une famille de confiance, avec un code d’accès familial commun ; ils ne constituent pas des comptes authentifiés indépendants. Seules les réponses du profil choisi sont modifiables dans l’interface. Les fonctions de sauvegarde limitent chaque opération au profil transmis et à la ligne concernée.

## Utilisation

- Le choix de personne précède l’ouverture du questionnaire. Changer de profil conserve les brouillons.
- « Ajouter une personne » permet de saisir son prénom et de commencer à raconter. Le nouveau profil est partagé avec toute la famille. Un prénom déjà présent (sans distinction de majuscules ou d’espaces) reprend le profil existant. L’ajout nécessite une connexion et le lien ou le code familial.
- Les réponses des autres portent leur prénom. « Je suis d’accord » copie leur réponse et leur note dans la version du profil actif. Le texte copié reste figé jusqu’à une nouvelle action explicite.
- « Je veux apporter une précision » ouvre la version du profil actif à l’édition ; si une version personnelle existe déjà, elle est conservée. Les photos de l’autre personne restent visibles sans être dupliquées.
- Brouillon local dans IndexedDB après chaque saisie (180 ms). Synchronisation et lecture des réponses partagées toutes les 60 secondes, au retour d’Internet, au retour sur l’onglet et via « Enregistrer maintenant ».
- La fermeture conserve le brouillon local. Une fermeture immédiate ne garantit pas une requête réseau ; le brouillon sera envoyé à la réouverture du profil. Le statut distingue clairement les enregistrements locaux et en ligne.
- Les réponses sont enregistrées séparément pour chaque question et personne. Une révision concurrente sur le même profil et le même souvenir demande un choix explicite. Une écriture ne remplace jamais toutes les réponses d’un autre profil.
- Conversations : période, lieu, interlocuteurs, sujet, ton, paroles et photos. Anecdotes : grand champ de texte.
- Les anciennes données IndexedDB du questionnaire sont importées dans Thibaut à sa première ouverture ; l’export et l’import JSON restent disponibles, ainsi que l’impression.
- Jusqu’à huit photos JPEG, PNG ou WebP par question ou conversation, réduites dans le navigateur. Les photos font partie des enregistrements partagés.

## Vérification locale

`node --test tests/core.test.cjs` vérifie l’isolation des profils et la protection des écritures concurrentes. `node tests/browser.cjs` utilise Playwright et un serveur Supabase simulé : aucun souvenir de test n’est écrit sur la base réelle. Renseigner `ALBERT_NODE_MODULES` si Playwright n’est pas résolu localement. Les captures sont dans `output/` (ignoré par Git).

Lancer `node serve.cjs` puis ouvrir http://127.0.0.1:4189/ pour l’aperçu. Le partage réel nécessite l’activation SQL et le code familial.

## Administration

Adresse : **https://orbytek.be/albert_65ans/admin.html**. Le mot de passe fixe demandé est `vasco`, vérifié dans les fonctions SQL côté serveur à chaque lecture ou modification. Il est conservé uniquement en mémoire pendant la session de la page admin.

Après `supabase/setup.sql`, appliquer `supabase/admin.sql`. Les participants ont maintenant une colonne `deleted_at` ; leurs données restent préservées lors d’une suppression et sont restaurables depuis la page admin. Les profils supprimés et leurs contributions disparaissent du questionnaire, du regroupement actif et de la galerie. Le serveur bloque leurs sauvegardes, y compris depuis un ancien onglet. Leurs prénoms restent réservés pour éviter une recréation involontaire du profil.

Le regroupement réunit les textes identiques par question et leurs auteurs, conserve chaque version différente et toutes les notes, conversations et anecdotes. Il n’invente aucune synthèse et ne remplace pas les originaux. Un export Markdown réunit l’ensemble ; la sauvegarde JSON inclut aussi les profils supprimés et leurs données. La galerie présente chaque photo avec son auteur, sa question ou sa conversation, un aperçu agrandi et un téléchargement.

Contrôles : `node --test tests/core.test.cjs tests/admin-core.test.cjs`, puis `node tests/admin-browser.cjs` avec le serveur local. `supabase/verify-admin.sql` teste les permissions et la suppression/restauration dans une transaction annulée.
