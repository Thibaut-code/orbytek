-- Vérification transactionnelle : toutes les écritures ci-dessous sont annulées.
begin;
do $$
declare code text; result jsonb; before_data jsonb; revision bigint;
begin
  select access_code into code from albert_private.settings where id;
  if (select count(*) from albert_private.questions) <> 165 then raise exception 'Nombre de questions incorrect'; end if;
  begin
    perform public.albert_snapshot('code-faux');
    raise exception 'Un mauvais code a été accepté';
  exception when insufficient_privilege then null; end;
  select data into before_data from albert_private.records where person='thibaut' and id='s0q0';
  select coalesce((select r.revision from albert_private.records r where person='maman' and id='s0q0'),0) into revision;
  result := public.albert_save(code,'maman',jsonb_build_array(jsonb_build_object(
    'id','s0q0','kind','question','baseRevision',revision,'data',jsonb_build_object('answer','TEST TRANSACTIONNEL','photos','[]'::jsonb))));
  if jsonb_array_length(result->'saved')<>1 then raise exception 'Enregistrement non effectué'; end if;
  if (select data from albert_private.records where person='thibaut' and id='s0q0') is distinct from before_data then raise exception 'Autre profil modifié'; end if;
  result := public.albert_save(code,'maman',jsonb_build_array(jsonb_build_object(
    'id','s0q0','kind','question','baseRevision',revision,'data',jsonb_build_object('answer','AUTRE VERSION'))));
  if jsonb_array_length(result->'conflicts')<>1 then raise exception 'Conflit non détecté'; end if;
  result := public.albert_save(code,'maman',jsonb_build_array(jsonb_build_object(
    'id','s0q0','kind','question','baseRevision',revision,'data',jsonb_build_object('answer','TEST TRANSACTIONNEL','photos','[]'::jsonb))));
  if jsonb_array_length(result->'saved')<>1 then raise exception 'Nouvelle tentative non idempotente'; end if;
  begin
    perform public.albert_save(code,'maman','[{"id":"s99q0","kind":"question","baseRevision":0,"data":{}}]'::jsonb);
    raise exception 'Question inconnue acceptée';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.albert_save(code,'autre','[]'::jsonb);
    raise exception 'Profil inconnu accepté';
  exception when invalid_parameter_value then null; end;
  if has_schema_privilege('anon','albert_private','usage') then raise exception 'Schéma privé accessible'; end if;
  if has_table_privilege('anon','albert_private.records','select') then raise exception 'Table privée accessible'; end if;
  if not has_function_privilege('anon','public.albert_snapshot(text)','execute') then raise exception 'Lecture RPC inaccessible'; end if;
  if not has_function_privilege('anon','public.albert_save(text,text,jsonb)','execute') then raise exception 'Sauvegarde RPC inaccessible'; end if;
end;
$$;
rollback;
select 'OK : code familial, 165 questions, profils isolés, conflits, réessai idempotent, contrôles des entrées et permissions. Aucune donnée de test conservée.' as verification;
