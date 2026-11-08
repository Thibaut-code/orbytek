# La Laguna — maquette indépendante

[Sommaire](../README.md) · [Socle premium](premium.md)

**Entrée :** [premium-sites/la-laguna/index.html](../../../premium-sites/la-laguna/index.html), style.css et script.js. Malgré son emplacement, cette maquette HTML/JS n'est pas une route Next de Maison Braise et n'exige pas de compilation.

Le menu, les traductions FR/NL, la galerie et le panier sont gérés localement. Le panier reste en mémoire de l'onglet et applique la remise affichée de 10 % à emporter ; il n'envoie aucune commande. Le formulaire bookingForm prépare date, nombre de personnes et préférence horaire puis oriente vers le lien Zenchef identifié dans le README. Il n'interroge pas les disponibilités et ne confirme pas la réservation lui-même.

Pas de comptes, de tables, paiement, notification ou API de commande propre. Les coordonnées et éléments de menu proviennent d'une consultation historique du site du restaurant indiquée dans [README.md](../../../premium-sites/la-laguna/README.md) ; ce ne sont pas des données commerciales fraîchement vérifiées pendant cet audit. Trois images culinaires sont explicitement illustratives.

Lancement : serveur statique commun, chemin `/premium-sites/la-laguna/`. Aucun service Node supplémentaire ni tests automatisés dédiés trouvés ; VALIDATION.md conserve des vérifications antérieures. La proposition ne prouve aucune modification ou reprise de l'hébergement du site officiel lalaguna.be.
