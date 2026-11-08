# Vérifications publiques

[Sommaire](../README.md) · [JSON complet](verification-externe.json)

Contrôle horodaté : 2026-11-04T20:53:44.038Z (UTC). Requêtes DNS, HEAD, lectures de scripts publics et négociations TLS uniquement. Aucun formulaire envoyé, aucune connexion utilisateur ni donnée métier consultée. Les premières tentatives sans accès réseau avaient échoué ; ce relevé contient la reprise réussie avec accès autorisé.

## Présence des pages

Un HTTP 200 ne valide ni la nature du contenu, ni le JavaScript, ni le parcours fonctionnel. Un 404 sur un chemin ne démontre pas que le projet n’existe sous aucune autre URL.

| URL sondée | HTTP | Redirection / erreur |
|---|---|---|
| [http://orbytek.be/](http://orbytek.be/) | 301 | https://orbytek.be/ |
| [https://orbytek.be/](https://orbytek.be/) | 200 | — |
| [https://orbytek.be/albert_65ans/](https://orbytek.be/albert_65ans/) | 200 | — |
| [https://orbytek.be/albert_65ans/admin.html](https://orbytek.be/albert_65ans/admin.html) | 200 | — |
| [https://orbytek.be/Archive/](https://orbytek.be/Archive/) | 200 | — |
| [https://orbytek.be/BD/albert/](https://orbytek.be/BD/albert/) | 200 | — |
| [https://orbytek.be/Chauffagiste/](https://orbytek.be/Chauffagiste/) | 200 | — |
| [https://orbytek.be/Chauffagiste2/](https://orbytek.be/Chauffagiste2/) | 404 | — |
| [https://orbytek.be/Chauffagiste3/](https://orbytek.be/Chauffagiste3/) | 404 | — |
| [https://orbytek.be/Coiffeur/](https://orbytek.be/Coiffeur/) | 404 | — |
| [https://orbytek.be/demos/immobilier/](https://orbytek.be/demos/immobilier/) | 200 | — |
| [https://orbytek.be/demos/paysagiste/](https://orbytek.be/demos/paysagiste/) | 200 | — |
| [https://orbytek.be/demos/restaurant/](https://orbytek.be/demos/restaurant/) | 200 | — |
| [https://orbytek.be/Facture/](https://orbytek.be/Facture/) | 200 | — |
| [https://orbytek.be/filmthibaut/](https://orbytek.be/filmthibaut/) | 200 | — |
| [https://orbytek.be/premium-sites/la-laguna/](https://orbytek.be/premium-sites/la-laguna/) | 200 | — |
| [https://orbytek.be/puériculture1/](https://orbytek.be/pu%C3%A9riculture1/) | 200 | — |
| [https://orbytek.be/puériculture2/](https://orbytek.be/pu%C3%A9riculture2/) | 200 | — |
| [https://orbytek.be/rendezvous/](https://orbytek.be/rendezvous/) | 200 | — |
| [https://orbytek.be/voiture/](https://orbytek.be/voiture/) | 404 | — |
| [https://orbytek.be/Voitures/](https://orbytek.be/Voitures/) | 200 | — |
| [https://test.orbytek.be/](https://test.orbytek.be/) | 200 | — |
| [https://www.orbytek.be/](https://www.orbytek.be/) | 301 | https://orbytek.be/ |

## Certificats TLS

| Hôte | Validation client | Émetteur | Début UTC | Fin UTC |
|---|---|---|---|---|
| orbytek.be | Valide | Let's Encrypt / YR1 | Sep 30 13:17:33 2026 GMT | Dec 29 13:17:32 2026 GMT |
| www.orbytek.be | Valide | Let's Encrypt / YR1 | Sep 30 13:17:33 2026 GMT | Dec 29 13:17:32 2026 GMT |
| test.orbytek.be | Valide | Let's Encrypt / YR1 | Oct 13 19:59:33 2026 GMT | Jan 11 19:59:32 2027 GMT |

La validité observée ne prouve pas le renouvellement futur. Registrar, titulaire et configuration interne de publication ne sont pas déductibles de ces certificats.

## Comparaison partielle local / production

| Script public | HTTP | Empreinte identique au fichier local |
|---|---|---|
| contact.js | 200 | Oui |
| Facture/app.js | 200 | **Non** |
| Voitures/data.js | 200 | Oui |
| albert_65ans/app.js | 200 | Oui |
| Archive/stream.js | 200 | **Non** |
| BD/albert/app.js | 200 | **Non** |

Les empreintes sont SHA-256 sur les octets reçus. Une différence peut correspondre à du code, des paramètres ou un simple formatage : aucun diff complet distant n’est affirmé ici. Une égalité d’un script ne prouve pas celle du reste de son application. Les fiches documentent le commit local indiqué au sommaire.

## DNS et GitHub

Les NS OVH, A/CNAME GitHub, MX et SPF sont détaillés dans [Infrastructure](../infrastructure.md), avec les réponses exactes dans le JSON. Aucun TXT DMARC retrouvé à cette date, sélecteur DKIM inconnu. Les lectures anonymes de configuration Pages retournent 404 : l’accès console reste nécessaire.
