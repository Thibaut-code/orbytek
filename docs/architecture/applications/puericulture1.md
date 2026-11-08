# Puériculture1 — catalogue de démonstration

[Sommaire](../README.md)

**Entrée :** [puériculture1/index.html](../../../puériculture1/index.html), fichier HTML intégrant styles et interactions ; médias et notes de sources sous assets/photos. Catalogue, sélection/panier, galeries et contact illustrent une boutique. Aucun backend de commerce, Auth ou base partagée n'a été identifié dans ce composant.

Les interactions de panier sont locales à la page ; elles ne réservent ni stock ni paiement. Le formulaire `f` intercepte submit, affiche le bloc de confirmation `ok` et désactive le bouton. Aucun fetch métier de commande/contact ne transmet ces données dans le code analysé. Il n'existe donc pas de table de commandes ni de webhook bancaire associé.

Les sources de photos et prompts sont des documents de préparation ; elles ne décrivent pas une intégration produit distante. Pas de compilation ni package dédié trouvé ; servir le chemin accentué avec le serveur commun. Le navigateur doit demander l'URL encodée correctement. Les validations et erreurs restent côté interface ; aucun système d'alerte serveur propre.
