# Dictionnaire des objets SQL présents

[Sommaire](README.md) · [Modèle et sécurité](donnees.md)

Analyse du 4 novembre 2026. Cette annexe extrait les définitions de tables et les changements de structure sans exécuter le SQL. Les définitions sont conservées pour donner les types, valeurs par défaut, nullabilité, PK, FK et CHECK exacts disponibles. Les évolutions ultérieures peuvent remplacer une contrainte initiale : lire la section des évolutions et l'ordre des migrations, pas seulement le CREATE initial. Les corps de fonctions, valeurs de codes d'accès, mots de passe et données insérées ne sont pas reproduits.

## public.document_counters

Compteurs transactionnels de numérotation par société, année et type.

Source : [Facture/supabase/migrations/20260926_upgrade.sql](../../Facture/supabase/migrations/20260926_upgrade.sql).

```sql
create table if not exists public.document_counters (
 user_id uuid not null references auth.users(id) on delete cascade,
 year integer not null, type text not null, last_value integer not null,
 primary key(user_id,year,type)
);
```

## public.document_send_history

Confirmation déclarative des envois.

Source : [Facture/supabase/migrations/20260926_upgrade.sql](../../Facture/supabase/migrations/20260926_upgrade.sql).

```sql
create table if not exists public.document_send_history (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 document_id uuid not null references public.documents(id) on delete cascade,
 recipient text not null, confirmed_at timestamptz not null default now(), method text not null default 'manual_confirmation'
);
```

## public.integration_jobs

Verrous et résultat des intégrations historiques.

Source : [Facture/supabase/migrations/20260926_upgrade.sql](../../Facture/supabase/migrations/20260926_upgrade.sql).

```sql
create table if not exists public.integration_jobs (
 document_id uuid not null references public.documents(id) on delete cascade, action text not null,
 user_id uuid not null references auth.users(id) on delete cascade,
 state text not null default 'processing', result jsonb, created_at timestamptz not null default now(),
 primary key(document_id,action)
);
```

## public.vat_purchases

Achats utilisés pour la préparation TVA.

Source : [Facture/supabase/migrations/20260930_vat.sql](../../Facture/supabase/migrations/20260930_vat.sql).

```sql
create table if not exists public.vat_purchases (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 supplier text not null check (length(trim(supplier)) between 1 and 200),
 reference text not null check (length(trim(reference)) between 1 and 200),
 invoice_date date not null,
 tax_date date not null,
 net_amount numeric(14,2) not null check (net_amount between 0 and 999999999),
 vat_amount numeric(14,2) not null check (vat_amount between 0 and 999999999),
 deduction_percent numeric(5,2) not null default 100 check (deduction_percent between 0 and 100),
 category text not null check (category in ('81','82','83')),
 created_at timestamptz not null default now()
);
```

## public.company_members

Appartenance active et préférences personnelles.

Source : [Facture/supabase/migrations/20261002_team.sql](../../Facture/supabase/migrations/20261002_team.sql).

```sql
create table if not exists public.company_members (
 member_id uuid primary key references auth.users(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 display_name text not null default '', role text not null check(role in ('owner','employee')),
 ui_theme text check(ui_theme in ('bleu','violet','corail','citron','turquoise','peche','orange','bordeaux','cyan','sable')),
 joined_at timestamptz not null default now(), check(role <> 'owner' or member_id=owner_id)
);
```

## public.company_invitations

Invitations par token haché, adresse et expiration.

Source : [Facture/supabase/migrations/20261002_team.sql](../../Facture/supabase/migrations/20261002_team.sql).

```sql
create table if not exists public.company_invitations (
 token_hash text primary key, owner_id uuid not null references auth.users(id) on delete cascade,
 email text not null, expires_at timestamptz not null, used_at timestamptz
);
```

## public.peppol_companies

Association société/environnement/fournisseur et activation.

Source : [Facture/supabase/migrations/20261012_peppol.sql](../../Facture/supabase/migrations/20261012_peppol.sql).

```sql
create table public.peppol_companies (
 user_id uuid not null references auth.users(id), environment text not null check(environment in ('playground','production')),
 provider_id text, team_id text, state text not null default 'not_started', verified boolean not null default false,
 reception_enabled boolean not null default false, peppol_id text, verification_url text, error text,
 updated_at timestamptz not null default now(), primary key(user_id,environment), unique(environment,provider_id)
);
```

## public.peppol_documents

Factures et avoirs entrants/sortants, état, contenu et archives.

Source : [Facture/supabase/migrations/20261012_peppol.sql](../../Facture/supabase/migrations/20261012_peppol.sql).

```sql
create table public.peppol_documents (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 environment text not null check(environment in ('playground','production')), provider_id text,
 source_id uuid references public.documents(id) on delete restrict,
 direction text not null check(direction in ('incoming','outgoing')), kind text not null default 'invoice', number text not null,
 party_name text not null default '', party_vat text not null default '', amount numeric(18,2), currency text not null default 'EUR', due_date date,
 status text not null default 'draft' check(status in ('draft','sending','sent','delivered','failed','unknown','received')),
 provider_status text, envelope_id text, provider_created_at timestamptz, failure jsonb not null default '[]',
 payload jsonb, parsed jsonb, validation jsonb, xml_path text, pdf_path text, archive_error text,
 read_at timestamptz, review_state text not null default 'to_review' check(review_state in ('to_review','verified','disputed')),
 paid_at timestamptz, business_response text, attempts integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(environment,provider_id), foreign key(user_id,environment) references public.peppol_companies(user_id,environment)
);
```

## public.peppol_events

Journal des changements et actions.

Source : [Facture/supabase/migrations/20261012_peppol.sql](../../Facture/supabase/migrations/20261012_peppol.sql).

```sql
create table public.peppol_events (
 id bigint generated always as identity primary key, user_id uuid not null references auth.users(id), environment text not null,
 document_id uuid references public.peppol_documents(id), event_type text not null, detail jsonb not null default '{}',
 actor_id uuid references auth.users(id), created_at timestamptz not null default now()
);
```

## public.peppol_webhook_events

Déduplication et suivi des événements fournisseur.

Source : [Facture/supabase/migrations/20261012_peppol.sql](../../Facture/supabase/migrations/20261012_peppol.sql).

```sql
create table public.peppol_webhook_events (
 digest text primary key, user_id uuid not null, environment text not null, payload jsonb not null,
 processed_at timestamptz, error text, created_at timestamptz not null default now()
);
```

## public.orbytek_contact_requests

File persistante du contact alternatif et suivi de notification.

Source : [Facture/supabase/migrations/20261104_orbytek_contact.sql](../../Facture/supabase/migrations/20261104_orbytek_contact.sql).

```sql
create table public.orbytek_contact_requests (
 id uuid primary key,
 payload_hash text not null,
 name text not null, email text not null, phone text not null default '',
 company text not null default '', project text not null, message text not null,
 origin text not null, created_at timestamptz not null default now(),
 read_status text not null default 'new' check(read_status in ('new','resolved')),
 notification_status text not null default 'pending' check(notification_status in ('pending','processing','sent','failed')),
 delivery_status text not null default 'unknown' check(delivery_status in ('unknown','delivered','bounced','failed','delayed')),
 email_id text unique, attempts integer not null default 0,
 next_attempt_at timestamptz not null default now(), lease_until timestamptz,
 lease_token uuid, last_error text, sent_at timestamptz
);
```

## public.orbytek_contact_limits

Compteurs de quota hachés.

Source : [Facture/supabase/migrations/20261104_orbytek_contact.sql](../../Facture/supabase/migrations/20261104_orbytek_contact.sql).

```sql
create table public.orbytek_contact_limits (bucket text primary key, hits integer not null, expires_at timestamptz not null);
```

## public.orbytek_contact_events

Événements de livraison e-mail.

Source : [Facture/supabase/migrations/20261104_orbytek_contact.sql](../../Facture/supabase/migrations/20261104_orbytek_contact.sql).

```sql
create table public.orbytek_contact_events (
 event_id text primary key, email_id text not null, status text not null,
 occurred_at timestamptz not null, received_at timestamptz not null default now()
);
```

## public.vehicle_admins

Liste explicite des comptes autorisés à administrer le catalogue.

Source : [Voitures/supabase/setup.sql](../../Voitures/supabase/setup.sql).

```sql
create table if not exists public.vehicle_admins (
    user_id uuid primary key references auth.users(id) on delete cascade
);
```

## public.voitures

Catalogue automobile public.

Source : [Voitures/supabase/setup.sql](../../Voitures/supabase/setup.sql).

```sql
create table if not exists public.voitures (
    id uuid primary key default gen_random_uuid(),
    marque text not null check (length(trim(marque)) between 1 and 80),
    modele text not null check (length(trim(modele)) between 1 and 160),
    annee integer not null check (annee between 1900 and 2100),
    km integer not null check (km between 0 and 10000000),
    prix integer not null check (prix between 0 and 100000000),
    carburant text not null check (carburant in ('Essence','Diesel','Hybride','Électrique','GPL','Autre')),
    boite text not null check (boite in ('Manuelle','Automatique')),
    categorie text not null check (categorie in ('Berline','SUV','Citadine','Premium','Autre')),
    badge text not null default '' check (badge in ('','Nouveau','Promo','Hybride','Électrique')),
    dispo boolean not null default true,
    photos jsonb not null default '[]'::jsonb check (public.valid_vehicle_photos(photos, id)),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

## public.vehicle_photo_cleanup

File des chemins de fichiers à nettoyer.

Source : [Voitures/supabase/setup.sql](../../Voitures/supabase/setup.sql).

```sql
create table if not exists public.vehicle_photo_cleanup (
    path text primary key check (path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}(-thumb)?\.webp$'),
    not_before timestamptz not null default (now() + interval '24 hours')
);
```

## albert_private.characters

Fiches et images de référence de personnages, réservées à l’administration.

Source : [albert_65ans/supabase/admin.sql](../../albert_65ans/supabase/admin.sql).

```sql
create table if not exists albert_private.characters (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 100),
  notes text not null default '' check (length(notes)<=4000),
  photos jsonb not null default '[]'::jsonb,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
```

## albert_private.settings

Paramètre d’accès familial ; table singleton.

Source : [albert_65ans/supabase/setup.sql](../../albert_65ans/supabase/setup.sql).

```sql
create table if not exists albert_private.settings (
  id boolean primary key default true check (id),
  access_code text not null default replace(gen_random_uuid()::text, '-', '')
);
```

## albert_private.questions

Identifiants stables de questions autorisées.

Source : [albert_65ans/supabase/setup.sql](../../albert_65ans/supabase/setup.sql).

```sql
create table if not exists albert_private.questions (id text primary key);
```

## albert_private.people

Participants familiaux, avec suppression logique.

Source : [albert_65ans/supabase/setup.sql](../../albert_65ans/supabase/setup.sql).

```sql
create table if not exists albert_private.people (
  id text primary key,
  name text not null check (length(name) between 1 and 80 and name=btrim(name)),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
```

## albert_private.records

Souvenirs par participant et identifiant, révision et données JSON.

Source : [albert_65ans/supabase/setup.sql](../../albert_65ans/supabase/setup.sql).

```sql
create table if not exists albert_private.records (
  person text not null references albert_private.people(id),
  id text not null,
  kind text not null check (kind in ('question','conversation','anecdote')),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  primary key (person, id)
);
```

## Tables historiques sans CREATE initial disponible

Les champs ci-dessous sont lus dans app.js, les RPC ou les ALTER ; ils ne certifient ni les types exacts ni les contraintes initiales. « Attendu » signifie forme utilisée par le code. PK/FK non créées dans les scripts disponibles restent à confirmer.

| Table | Champs utilisés et forme attendue | Contraintes et limites de preuve |
|---|---|---|
| public.companies | user_id (identifiant propriétaire), name/address/vat/iban/email/logo_shape, updated_at ; street/house_number/box/postal_code/city/country ; logo, catalogs, appearance, theme, ui_theme | Coordonnées et catalogues de société ; champs ajoutés typés dans les ALTER ci-dessous ; unicité user_id supposée par upsert, à vérifier dans le DDL réel |
| public.clients | id, user_id, name/address/email ; note/vat/peppol_id/street/postal_code/city/country | Le code filtre par propriétaire ; PK, FK et colonnes initiales à exporter |
| public.documents | id/user_id/client_id/converted_from/created_by (identifiants), number/type/job/site (texte attendu), issue_date/due_date/vat_date, paid (booléen attendu), paid_at/sent_at, issuer_snapshot/customer_snapshot/appearance/recurrence/peppol (JSON attendu) | Base de factures/devis ; save_document_v2 valide type et lignes ; created_by FK ajoutée ; paid_at utilisé mais son ALTER initial manque |
| public.document_lines | id/user_id/document_id, position, name, quantity/unit_price/vat_rate | Forme numérique pour quantité/prix/taux, uuid pour document selon RPC ; types exacts et FK initiaux non fournis |
| public.payment_reminders | id/user_id/document_id, recipient/subject/body/status, created_at/confirmed_at | app.js écrit prepared puis confirmed ; DDL, défauts, index et cascades à confirmer |
| public.profiles | Table mentionnée dans LISEZ-MOI historique | Pas de DDL ni de parcours courant identifié l’utilisant dans les fichiers étudiés ; existence distante non attestée |

Sources : [Facture/app.js](../../Facture/app.js), [Facture/supabase/migrations/20260926_upgrade.sql](../../Facture/supabase/migrations/20260926_upgrade.sql), [Facture/supabase/migrations/20261002_team.sql](../../Facture/supabase/migrations/20261002_team.sql).

## Évolutions des tables, index et déclencheurs

Les instructions suivantes sont présentées dans leurs fichiers, sans prétendre qu'elles sont appliquées. Les blocs dynamiques de policies et de modification de RPC doivent également être lus dans leurs sources. Les index des PK/UNIQUE sont implicites dans les définitions de tables.

### Facture/supabase/migrations/20260926_upgrade.sql

[Facture/supabase/migrations/20260926_upgrade.sql](../../Facture/supabase/migrations/20260926_upgrade.sql)

```sql
alter table public.companies add column if not exists street text;
alter table public.companies add column if not exists house_number text;
alter table public.companies add column if not exists box text;
alter table public.companies add column if not exists postal_code text;
alter table public.companies add column if not exists city text;
alter table public.companies add column if not exists country text default 'BE';
alter table public.companies add column if not exists appearance jsonb;
alter table public.companies add column if not exists theme text default 'plombier';
alter table public.companies add column if not exists logo text;
alter table public.companies add column if not exists catalogs jsonb default '{}'::jsonb;
alter table public.clients add column if not exists note text;
alter table public.clients add column if not exists vat text;
alter table public.clients add column if not exists peppol_id text;
alter table public.clients add column if not exists street text;
alter table public.clients add column if not exists postal_code text;
alter table public.clients add column if not exists city text;
alter table public.clients add column if not exists country text default 'BE';
alter table public.documents add column if not exists appearance jsonb;
alter table public.documents add column if not exists sent_at timestamptz;
alter table public.documents add column if not exists peppol jsonb;
alter table public.documents add column if not exists recurrence jsonb;
alter table public.companies drop constraint if exists companies_theme_check;
alter table public.companies add constraint companies_theme_check check (theme in ('plombier','jardinier','electricien','peintre','menuisier','it','nettoyage','mecanicien','photographe','consultant'));
```

### Facture/supabase/migrations/20260930_vat.sql

[Facture/supabase/migrations/20260930_vat.sql](../../Facture/supabase/migrations/20260930_vat.sql)

```sql
alter table public.documents add column if not exists vat_date date;
create index if not exists vat_purchases_user_date on public.vat_purchases(user_id,tax_date);
```

### Facture/supabase/migrations/20261001_interface.sql

[Facture/supabase/migrations/20261001_interface.sql](../../Facture/supabase/migrations/20261001_interface.sql)

```sql
alter table public.companies add column if not exists theme text not null default 'plombier';
alter table public.companies add column if not exists ui_theme text not null default 'bleu';
alter table public.companies drop constraint if exists companies_ui_theme_check;
alter table public.companies add constraint companies_ui_theme_check
  check (ui_theme in ('bleu','violet','corail','citron','turquoise','peche','orange','bordeaux','cyan','sable'));
```

### Facture/supabase/migrations/20261002_orbytek_interface.sql

[Facture/supabase/migrations/20261002_orbytek_interface.sql](../../Facture/supabase/migrations/20261002_orbytek_interface.sql)

```sql
alter table public.companies drop constraint if exists companies_ui_theme_check;
alter table public.companies add constraint companies_ui_theme_check
  check (ui_theme in ('bleu','violet','corail','citron','turquoise','peche','orange','bordeaux','cyan','sable','classique','orbytek'));
alter table public.company_members drop constraint if exists company_members_ui_theme_check;
alter table public.company_members add constraint company_members_ui_theme_check
  check (ui_theme in ('bleu','violet','corail','citron','turquoise','peche','orange','bordeaux','cyan','sable','classique','orbytek'));
```

### Facture/supabase/migrations/20261002_original_interface.sql

[Facture/supabase/migrations/20261002_original_interface.sql](../../Facture/supabase/migrations/20261002_original_interface.sql)

```sql
alter table public.companies drop constraint if exists companies_ui_theme_check;
alter table public.companies add constraint companies_ui_theme_check
  check (ui_theme in ('bleu','violet','corail','citron','turquoise','peche','orange','bordeaux','cyan','sable','classique'));
alter table public.company_members drop constraint if exists company_members_ui_theme_check;
alter table public.company_members add constraint company_members_ui_theme_check
  check (ui_theme in ('bleu','violet','corail','citron','turquoise','peche','orange','bordeaux','cyan','sable','classique'));
```

### Facture/supabase/migrations/20261002_team.sql

[Facture/supabase/migrations/20261002_team.sql](../../Facture/supabase/migrations/20261002_team.sql)

```sql
alter table public.documents add column if not exists created_by uuid references auth.users(id) on delete set null;
create trigger record_document_employee before insert or update on public.documents for each row execute function public.record_document_employee();
```

### Facture/supabase/migrations/20261008_default_orbytek.sql

[Facture/supabase/migrations/20261008_default_orbytek.sql](../../Facture/supabase/migrations/20261008_default_orbytek.sql)

```sql
alter table public.companies alter column ui_theme set default 'orbytek';
```

### Facture/supabase/migrations/202610120002_peppol_corrections.sql

[Facture/supabase/migrations/202610120002_peppol_corrections.sql](../../Facture/supabase/migrations/202610120002_peppol_corrections.sql)

```sql
alter table public.peppol_companies add column webhook_id text;
alter table public.peppol_companies add column webhook_error text;
```

### Facture/supabase/migrations/20261012_peppol.sql

[Facture/supabase/migrations/20261012_peppol.sql](../../Facture/supabase/migrations/20261012_peppol.sql)

```sql
create unique index peppol_source_once on public.peppol_documents(user_id,environment,source_id,kind) where source_id is not null;
create unique index peppol_outgoing_number on public.peppol_documents(user_id,environment,kind,number) where direction='outgoing';
create index peppol_company_documents on public.peppol_documents(user_id,environment,created_at desc);
create trigger peppol_audit after insert or update on public.peppol_documents for each row execute function public.peppol_record_change();
create trigger peppol_protect_document before update or delete on public.documents for each row execute function public.peppol_protect_source();
create trigger peppol_protect_lines before insert or update or delete on public.document_lines for each row execute function public.peppol_protect_source();
```

### Facture/supabase/migrations/20261104_orbytek_contact.sql

[Facture/supabase/migrations/20261104_orbytek_contact.sql](../../Facture/supabase/migrations/20261104_orbytek_contact.sql)

```sql
create index orbytek_contact_due on public.orbytek_contact_requests(next_attempt_at) where notification_status in ('pending','processing');
create index orbytek_contact_event_email on public.orbytek_contact_events(email_id,occurred_at desc);
```

### Voitures/supabase/setup.sql

[Voitures/supabase/setup.sql](../../Voitures/supabase/setup.sql)

```sql
create index if not exists voitures_catalogue_order on public.voitures(created_at desc, id);
create trigger vehicle_stamp before update on public.voitures for each row execute function public.vehicle_stamp();
create trigger vehicle_queue_photos after insert or update or delete on public.voitures for each row execute function public.vehicle_queue_photos();
```

### albert_65ans/supabase/admin.sql

[albert_65ans/supabase/admin.sql](../../albert_65ans/supabase/admin.sql)

```sql
create unique index if not exists characters_name_unique on albert_private.characters (lower(regexp_replace(btrim(name),'\s+',' ','g')));
```

### albert_65ans/supabase/setup.sql

[albert_65ans/supabase/setup.sql](../../albert_65ans/supabase/setup.sql)

```sql
alter table albert_private.people add column if not exists deleted_at timestamptz;
create unique index if not exists albert_people_name_unique on albert_private.people(lower(name));
alter table albert_private.records drop constraint if exists records_person_check;
alter table albert_private.records add constraint records_person_fkey foreign key(person) references albert_private.people(id);
```

## Catalogue des fonctions et politiques statiques

Les noms/signatures désignent des objets prévus par les sources. Le rôle, les grants et le chemin des contrôles sont expliqués dans [Données](donnees.md), [Flux](flux.md) et les fiches. Les SECURITY DEFINER exigent une revue de la définition effectivement installée.

| Source | Fonctions définies ou remplacées | Policies explicitement nommées |
|---|---|---|
| [Facture/supabase/migrations/20260926_upgrade.sql](../../Facture/supabase/migrations/20260926_upgrade.sql) | `public.save_document_v2(payload jsonb)`<br>`public.confirm_document_send(document_id uuid, recipient text)`<br>`public.begin_integration_job(target_document uuid,target_user uuid,target_action text,expected_document jsonb,expected_lines jsonb)` | `own_send_history` |
| [Facture/supabase/migrations/20260930_vat.sql](../../Facture/supabase/migrations/20260930_vat.sql) | — | `own_vat_purchases` |
| [Facture/supabase/migrations/20261002_orbytek_interface.sql](../../Facture/supabase/migrations/20261002_orbytek_interface.sql) | `public.set_interface_preference(interface_key text)` | — |
| [Facture/supabase/migrations/20261002_original_interface.sql](../../Facture/supabase/migrations/20261002_original_interface.sql) | `public.set_interface_preference(interface_key text)` | — |
| [Facture/supabase/migrations/20261002_team.sql](../../Facture/supabase/migrations/20261002_team.sql) | `public.active_company_owner()`<br>`public.company_context()`<br>`public.set_employee_name(employee_name text)`<br>`public.set_interface_preference(interface_key text)`<br>`public.invite_company_employee(employee_email text)`<br>`public.join_company(invitation_token text)`<br>`public.list_company_team()`<br>`public.remove_company_employee(employee_id uuid)`<br>`public.record_document_employee()` | `own_membership`, `company_access` |
| [Facture/supabase/migrations/202610120001_peppol_locking.sql](../../Facture/supabase/migrations/202610120001_peppol_locking.sql) | `public.peppol_claim_send(owner uuid, mode text, source uuid, expected_doc jsonb, expected_lines jsonb, body jsonb, actor uuid)`<br>`public.peppol_protect_source()` | — |
| [Facture/supabase/migrations/202610120002_peppol_corrections.sql](../../Facture/supabase/migrations/202610120002_peppol_corrections.sql) | `public.peppol_prepare_correction(owner uuid, target uuid, actor uuid)` | — |
| [Facture/supabase/migrations/20261012_peppol.sql](../../Facture/supabase/migrations/20261012_peppol.sql) | `public.peppol_claim_send(owner uuid, mode text, source uuid, expected_doc jsonb, expected_lines jsonb, body jsonb, actor uuid)`<br>`public.peppol_record_change()`<br>`public.peppol_protect_source()` | `company_read` |
| [Facture/supabase/migrations/20261104_orbytek_contact.sql](../../Facture/supabase/migrations/20261104_orbytek_contact.sql) | `public.orbytek_contact_enqueue(p_id uuid,p_hash text,p_data jsonb,p_buckets text[])`<br>`public.orbytek_contact_claim()`<br>`public.orbytek_contact_finish(p_id uuid,p_lease uuid,p_email_id text,p_error text,p_retry boolean)`<br>`public.orbytek_contact_event(p_event text,p_email text,p_status text,p_time timestamptz)` | — |
| [Voitures/supabase/setup.sql](../../Voitures/supabase/setup.sql) | `public.is_vehicle_admin()`<br>`public.valid_vehicle_photos(items jsonb, vehicle_id uuid)`<br>`public.vehicle_brands()`<br>`public.vehicle_stamp()`<br>`public.vehicle_queue_photos()`<br>`public.vehicle_photo_in_use(object_path text)` | `"vehicle_admin_self"`, `"vehicle_public_read"`, `"vehicle_admin_insert"`, `"vehicle_admin_update"`, `"vehicle_admin_delete"`, `"vehicle_cleanup_admin"`, `"vehicle_storage_read"`, `"vehicle_storage_insert"`, `"vehicle_storage_delete"` |
| [albert_65ans/supabase/admin.sql](../../albert_65ans/supabase/admin.sql) | `public.albert_admin_snapshot(p_password text)`<br>`public.albert_admin_remove_person(p_password text,p_person text)`<br>`public.albert_admin_restore_person(p_password text,p_person text)`<br>`public.albert_admin_save_character(p_password text,p_id uuid,p_name text,p_notes text,p_photos jsonb,p_revision integer)`<br>`public.albert_admin_delete_character(p_password text,p_id uuid,p_revision integer)` | — |
| [albert_65ans/supabase/setup.sql](../../albert_65ans/supabase/setup.sql) | `public.albert_people(p_code text)`<br>`public.albert_add_person(p_code text,p_name text)`<br>`public.albert_snapshot(p_code text)`<br>`public.albert_save(p_code text, p_person text, p_changes jsonb)` | — |

Les policies dynamiques `company_access` (tables métier) et `company_read` (Peppol) sont construites dans les migrations. RLS activé + droits révoqués sans policy autorisante signifie absence d’accès client direct, notamment pour le contact et albert_private. Le fichier supabase-security-audit.sql fournit des requêtes d’audit, pas une preuve de leur résultat distant.
