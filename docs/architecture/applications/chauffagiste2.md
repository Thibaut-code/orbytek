# Chauffagiste2 — variante de démonstration

[Sommaire](../README.md)

**Entrée :** [Chauffagiste2/index.html](../../../Chauffagiste2/index.html), qui contient styles et JavaScript. Démonstration autonome de services, réalisations, zone et estimation ; pas de package, compilation, API ou base métier identifiée.

Le formulaire `zf` recherche un code postal/une commune dans un tableau local et affiche une zone reconnue ou une invitation à appeler. Le formulaire `f` intercepte submit, affiche le bloc `ok` et désactive le bouton. **Aucune demande n'est transmise.** Les calculs et filtres restent dans le navigateur ; les coordonnées d'exemple ne doivent pas être prises pour un raccordement réel.

Pas d'authentification ou rôle, notification ou fichier joint traité côté serveur. Erreurs limitées à la validation et aux retours locaux. Servir `/Chauffagiste2/` avec `node premium-sites/scripts/serve.mjs` ; aucun test dédié trouvé dans ce dossier. Un raccordement réel demanderait une intégration distincte ; il n'est pas réalisé par la présence de Chauffagiste/FORMULAIRE.md, qui concerne la première variante.
