# Chauffagiste3 — variante de démonstration

[Sommaire](../README.md)

**Entrée :** [Chauffagiste3/index.html](../../../Chauffagiste3/index.html). HTML, CSS et JavaScript intégrés ; contenu de services et contact, animations et interactions visuelles. Pas de build, compte, table ou API métier identifiée.

Le formulaire appelle `handleSubmit(event)`. Cette fonction exécute preventDefault, remplace le texte du bouton par une confirmation et une promesse de rappel, change son style et le désactive. Elle n'appelle aucun service d'envoi. Le message affiché ne prouve donc pas une demande reçue. Pas de pièce jointe ou gestion serveur des erreurs.

Lancement via serveur statique commun et chemin `/Chauffagiste3/`. Aucun test dédié trouvé dans ce dossier. Domaine et publication réelle à confirmer comme pour les autres sous-dossiers. Voir [les constats](../inconnues.md) concernant les confirmations de démonstration.
