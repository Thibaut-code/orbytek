-- Administration du questionnaire. Mot de passe fixe demandé : vasco.
-- Les vérifications sont faites côté serveur pour chaque opération.
begin;
create or replace function public.albert_admin_snapshot(p_password text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare family_code text; snapshot jsonb;
begin
  if p_password is distinct from 'vasco' then
    raise exception 'Mot de passe incorrect' using errcode='42501';
  end if;
  select access_code into family_code from albert_private.settings where id;
  snapshot:=public.albert_snapshot(family_code);
  return snapshot || jsonb_build_object(
    'archivedPeople',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'name',p.name,'deletedAt',p.deleted_at)
      order by p.deleted_at desc) from albert_private.people p where p.deleted_at is not null),'[]'::jsonb),
    'archivedRecords',coalesce((select jsonb_agg(jsonb_build_object('person',r.person,'id',r.id,'kind',r.kind,
      'data',r.data,'revision',r.revision,'updatedAt',r.updated_at))
      from albert_private.records r join albert_private.people p on p.id=r.person where p.deleted_at is not null),'[]'::jsonb));
end;
$$;

create or replace function public.albert_admin_remove_person(p_password text,p_person text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare participant albert_private.people%rowtype;
begin
  if p_password is distinct from 'vasco' then
    raise exception 'Mot de passe incorrect' using errcode='42501';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('albert:' || coalesce(p_person,''),0));
  select * into participant from albert_private.people where id=p_person for update;
  if not found then raise exception 'Personne inconnue' using errcode='22023'; end if;
  update albert_private.people set deleted_at=coalesce(deleted_at,now()) where id=p_person;
  return jsonb_build_object('removed',true,'id',p_person);
end;
$$;

create or replace function public.albert_admin_restore_person(p_password text,p_person text)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if p_password is distinct from 'vasco' then
    raise exception 'Mot de passe incorrect' using errcode='42501';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('albert:' || coalesce(p_person,''),0));
  update albert_private.people set deleted_at=null where id=p_person;
  if not found then raise exception 'Personne inconnue' using errcode='22023'; end if;
  return jsonb_build_object('restored',true,'id',p_person);
end;
$$;
revoke all on function public.albert_admin_snapshot(text) from public;
revoke all on function public.albert_admin_remove_person(text,text) from public;
revoke all on function public.albert_admin_restore_person(text,text) from public;
grant execute on function public.albert_admin_snapshot(text) to anon,authenticated;
grant execute on function public.albert_admin_remove_person(text,text) to anon,authenticated;
grant execute on function public.albert_admin_restore_person(text,text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
