# Atelier — rendez-vous de démonstration

[Sommaire](../README.md)

**Entrée :** [rendezvous/index.html](../../../rendezvous/index.html), autonome avec CSS/JS intégrés. preview.html est un aperçu illustratif pour le portfolio. [README.md](../../../rendezvous/README.md) décrit le parcours et les limites.

Le visiteur choisit prestation, professionnel, date et créneau, saisit ses coordonnées fictives, coche la simulation et confirme. L'espace salon propose agenda, liste, recherche, indicateurs, modification et annulation. La modification conserve la référence et refuse un conflit sans perdre le rendez-vous initial. Trente rendez-vous fictifs sont initialisés sur cinq jours pour Camille et Alex.

Le calendrier ouvre du mardi au samedi de 9 à 18 heures, heure de Bruxelles, dans une fenêtre de 89 jours avec une heure de préavis. Les données sont dans localStorage `atelier-demo-v2` ; une migration locale de v1 est prévue. Sans stockage, l'état reste en mémoire. L'événement storage actualise les onglets d'un même navigateur ; aucune base partagée ou protection transactionnelle serveur.

Pas de compte salon réel, notification, réservation distante ou e-mail envoyé. La confirmation par e-mail est présentée comme raccordement futur. Les informations saisies peuvent rester dans le navigateur jusqu'à réinitialisation/effacement, d'où l'usage de données fictives.

Aucune installation ni compilation. Ouvrir la page ou la servir sous `/rendezvous/`. Les vérifications antérieures décrites dans le README sont des simulations ; aucune suite autonome dédiée n'a été trouvée dans ce dossier ni relancée pendant l'audit. Photos/polices externes peuvent nécessiter Internet.
