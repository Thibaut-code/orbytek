# Inventaire technique

[Sommaire](README.md)

Inventaire du 4 novembre 2026, issu des chemins locaux et des manifestes. Les fichiers générés, médias et sauvegardes privées ne sont pas détaillés individuellement. Les dossiers de rapports et output sont des artefacts, pas des applications supplémentaires.

## Dossiers de premier niveau

| Dossier | Rôle |
|---|---|
| .git | Métadonnées du dépôt, hors application |
| .github | Workflow de copie staging |
| albert_65ans | Questionnaire et administration familiaux |
| anniversaire | Atelier de production BD et préparation liseuse |
| Archive | Lecteur et segments vidéo HLS |
| assets | Médias et ressources partagés |
| BD | Publication chiffrée de la BD, sous BD/albert |
| Chauffagiste | Site et devis FormSubmit.io |
| Chauffagiste2 | Variante statique simulée |
| Chauffagiste3 | Variante statique simulée |
| Coiffeur | Site et réservation simulée |
| demos | Exports Next.js publiables |
| docs | Documentation ajoutée par cet audit |
| Facture | Facturation, TVA, équipe et intégrations |
| filmthibaut | Lecteur source, médias et traitements vidéo |
| output | Artefacts de travail / validation |
| premium-sites | Sources React/Next, outils et API facultative |
| puériculture1 | Catalogue de démonstration |
| puériculture2 | Fichier index non HTML ; contenu Office |
| rendezvous | Simulation locale de rendez-vous |
| reports | Rapports de vérification antérieurs |
| scripts | Outils communs SEO, aperçus et tests de service |
| tests | Tests du contact et de ses alternatives |
| Voitures | Catalogue automobile et administration Supabase |

## Versions verrouillées des sources premium

| Dépendance | Version package-lock |
|---|---|
| next | 16.3.8 |
| react | 19.3.0 |
| react-dom | 19.3.0 |
| framer-motion | 12.43.0 |
| tailwindcss | 4.3.3 |
| typescript | 5.9.3 |
| lucide-react | 0.468.0 |
| lighthouse | 13.5.0 |
| prettier | 3.9.9 |

## Pages et formulaires source

Les identifiants et noms de champs sont listés sans valeur saisie ou attribut de secret. Les formulaires créés dynamiquement dans app.js/shared.tsx sont décrits dans [Flux](flux.md) ; la liste ci-dessous recense le HTML statique uniquement.

| Page | Formulaires et noms de champs HTML |
|---|---|
| [404.html](../../404.html) | Pas de formulaire statique repéré |
| [applications-sur-mesure.html](../../applications-sur-mesure.html) | Pas de formulaire statique repéré |
| [creation-preview-05.html](../../creation-preview-05.html) | Pas de formulaire statique repéré |
| [creation-preview-06.html](../../creation-preview-06.html) | Pas de formulaire statique repéré |
| [creation-preview-07.html](../../creation-preview-07.html) | Pas de formulaire statique repéré |
| [creation-preview-08.html](../../creation-preview-08.html) | Pas de formulaire statique repéré |
| [creation-preview-1.html](../../creation-preview-1.html) | Pas de formulaire statique repéré |
| [creation-preview-2.html](../../creation-preview-2.html) | Pas de formulaire statique repéré |
| [creation-preview-3.html](../../creation-preview-3.html) | `estimForm` : champs sans name / construits en JS<br>`contactForm` : champs sans name / construits en JS |
| [creation-preview-4.html](../../creation-preview-4.html) | `reservationForm` : `service`, `coiffeur`, `date`, `heure`, `message`, `prenom`, `nom`, `email`, `tel`, `newsletter`<br>`sans id` : champs sans name / construits en JS |
| [creation-sites-web.html](../../creation-sites-web.html) | Pas de formulaire statique repéré |
| [creations.html](../../creations.html) | Pas de formulaire statique repéré |
| [index.html](../../index.html) | `orbytek-contact-form` : `website`, `name`, `email`, `phone`, `company`, `project`, `message` |
| [integrations-automatisations.html](../../integrations-automatisations.html) | Pas de formulaire statique repéré |
| [mentions-legales.html](../../mentions-legales.html) | Pas de formulaire statique repéré |
| [merci.html](../../merci.html) | Pas de formulaire statique repéré |
| [projet-facture-facile.html](../../projet-facture-facile.html) | Pas de formulaire statique repéré |
| [support-informatique.html](../../support-informatique.html) | Pas de formulaire statique repéré |
| [tarifs.html](../../tarifs.html) | Pas de formulaire statique repéré |
| [Chauffagiste/index.html](../../Chauffagiste/index.html) | `devisForm` : `_formsubmit_id`, `prenom`, `nom`, `tel`, `email`, `prestation`, `bien`, `message`, `consentement` |
| [Chauffagiste2/index.html](../../Chauffagiste2/index.html) | `zf` : champs sans name / construits en JS<br>`f` : `n`, `t`, `m` |
| [Chauffagiste3/index.html](../../Chauffagiste3/index.html) | `sans id` : champs sans name / construits en JS |
| [Coiffeur/index.html](../../Coiffeur/index.html) | `reservationForm` : `service`, `coiffeur`, `date`, `heure`, `message`, `prenom`, `nom`, `email`, `tel`, `newsletter`<br>`sans id` : champs sans name / construits en JS |
| [Facture/accueil.html](../../Facture/accueil.html) | Pas de formulaire statique repéré |
| [Facture/index.html](../../Facture/index.html) | Pas de formulaire statique repéré |
| [Facture/outlook-callback.html](../../Facture/outlook-callback.html) | Pas de formulaire statique repéré |
| [Voitures/admin.html](../../Voitures/admin.html) | `loginForm` : `email`, `password`<br>`vehicleForm` : `marque`, `modele`, `annee`, `km`, `prix`, `categorie`, `carburant`, `boite`, `badge`, `dispo` |
| [Voitures/index.html](../../Voitures/index.html) | `estimForm` : champs sans name / construits en JS<br>`contactForm` : champs sans name / construits en JS |
| [rendezvous/index.html](../../rendezvous/index.html) | `booking-form` : `name`, `email`, `phone`, `consent`<br>`edit-form` : `service`, `staff`, `date`, `start`, `name`, `email`, `phone` |
| [rendezvous/preview.html](../../rendezvous/preview.html) | Pas de formulaire statique repéré |
| [puériculture1/index.html](../../pu%C3%A9riculture1/index.html) | `f` : champs sans name / construits en JS |
| [puériculture2/index.html](../../pu%C3%A9riculture2/index.html) | **Binaire ZIP/Office, pas de HTML analysable** |
| [albert_65ans/admin.html](../../albert_65ans/admin.html) | `adminLoginForm` : champs sans name / construits en JS<br>`characterForm` : champs sans name / construits en JS |
| [albert_65ans/index.html](../../albert_65ans/index.html) | `newPersonForm` : champs sans name / construits en JS<br>`accessForm` : champs sans name / construits en JS |
| [albert_65ans/questionnaire_albert_courtois.html](../../albert_65ans/questionnaire_albert_courtois.html) | Pas de formulaire statique repéré |
| [BD/albert/index.html](../../BD/albert/index.html) | `login` : champs sans name / construits en JS |
| [Archive/index.html](../../Archive/index.html) | `add` : champs sans name / construits en JS |
| [filmthibaut/index.html](../../filmthibaut/index.html) | `add` : champs sans name / construits en JS |
| [premium-sites/la-laguna/index.html](../../premium-sites/la-laguna/index.html) | `bookingForm` : champs sans name / construits en JS |

## Fichiers structurants

- [README.md](../../README.md)
- [CONTACT-SETUP.md](../../CONTACT-SETUP.md)
- [CNAME](../../CNAME)
- [.github/workflows/deploy-staging.yml](../../.github/workflows/deploy-staging.yml)
- [supabase-security-audit.sql](../../supabase-security-audit.sql)
- [Facture/LISEZ-MOI.md](../../Facture/LISEZ-MOI.md)
- [Facture/PEPPOL.md](../../Facture/PEPPOL.md)
- [Facture/supabase/config.toml](../../Facture/supabase/config.toml)
- [Voitures/README.md](../../Voitures/README.md)
- [Voitures/supabase/setup.sql](../../Voitures/supabase/setup.sql)
- [albert_65ans/README.md](../../albert_65ans/README.md)
- [anniversaire/site-bd-albert/LISEZ-MOI.md](../../anniversaire/site-bd-albert/LISEZ-MOI.md)
- [premium-sites/README.md](../../premium-sites/README.md)
- [premium-sites/next.config.mjs](../../premium-sites/next.config.mjs)
- [premium-sites/scripts/export.mjs](../../premium-sites/scripts/export.mjs)
- [premium-sites/server/lead-api.mjs](../../premium-sites/server/lead-api.mjs)
- [filmthibaut/README.md](../../filmthibaut/README.md)
- [filmthibaut/analysis/publication-verification.json](../../filmthibaut/analysis/publication-verification.json)
- [rendezvous/README.md](../../rendezvous/README.md)
- [premium-sites/la-laguna/README.md](../../premium-sites/la-laguna/README.md)

Les chemins de fichiers ne démontrent pas leur publication. Les imports de dépendances vendoriées et les bundles exportés ne sont pas une base de données. Les .env existants sont exclus de cet inventaire de contenu.
