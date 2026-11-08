# Chauffagiste — Chauffage Dupuis

[Sommaire](../README.md) · [Flux devis](../flux.md#devis-chauffagiste)

**Entrée :** [Chauffagiste/index.html](../../../Chauffagiste/index.html), style.css et [script.js](../../../Chauffagiste/script.js). Site HTML natif : services, réalisations, zone, FAQ et devis. Pas de compilation, compte client ou base locale de demandes.

Le formulaire devisForm utilise un POST natif FormSubmit.io. Champs : prenom, nom, tel, email, prestation, bien, message et consentement ; les obligations sont définies dans le HTML, l'e-mail est facultatif dans ce formulaire. Le JS vérifie les champs, affiche des erreurs et conserve l'envoi natif ; le honeypot `_formsubmit_id` vise les bots. Aucune pièce jointe identifiée. La destination est attachée à l'identifiant fournisseur, avec e-mail Orbytek déclaré dans FORMULAIRE.md.

Le guide [FORMULAIRE.md](../../../Chauffagiste/FORMULAIRE.md) rapporte une activation et une demande de test reçue par le service le 4 novembre, sans vérification de réception en boîte ni parcours navigateur publié complet. L'état de livraison dépend du forfait fournisseur. Aucune nouvelle soumission n'a été faite pour cet audit.

Le thème est conservé dans localStorage `dupuis-theme`. Les médias sont locaux et/ou distants selon le HTML. Les erreurs de validation sont rendues dans la page ; aucun journal serveur géré par le site. Lancement via le serveur statique commun sur `/Chauffagiste/`, publication des trois fichiers et médias sans build. Le circuit contact est distinct de Web3Forms à la racine et de Resend dans Facture.
