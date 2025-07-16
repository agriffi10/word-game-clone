create table "public"."all_words" (
    "id" bigint generated always as identity not null,
    "word" text
);


CREATE UNIQUE INDEX all_words_pkey ON public.all_words USING btree (id);

alter table "public"."all_words" add constraint "all_words_pkey" PRIMARY KEY using index "all_words_pkey";

grant delete on table "public"."all_words" to "anon";

grant insert on table "public"."all_words" to "anon";

grant references on table "public"."all_words" to "anon";

grant select on table "public"."all_words" to "anon";

grant trigger on table "public"."all_words" to "anon";

grant truncate on table "public"."all_words" to "anon";

grant update on table "public"."all_words" to "anon";

grant delete on table "public"."all_words" to "authenticated";

grant insert on table "public"."all_words" to "authenticated";

grant references on table "public"."all_words" to "authenticated";

grant select on table "public"."all_words" to "authenticated";

grant trigger on table "public"."all_words" to "authenticated";

grant truncate on table "public"."all_words" to "authenticated";

grant update on table "public"."all_words" to "authenticated";

grant delete on table "public"."all_words" to "service_role";

grant insert on table "public"."all_words" to "service_role";

grant references on table "public"."all_words" to "service_role";

grant select on table "public"."all_words" to "service_role";

grant trigger on table "public"."all_words" to "service_role";

grant truncate on table "public"."all_words" to "service_role";

grant update on table "public"."all_words" to "service_role";


