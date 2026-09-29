import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Auteur = Database["public"]["Tables"]["auteurs"]["Row"];
export type Oeuvre = Database["public"]["Tables"]["oeuvres"]["Row"];
export type OeuvreAvecAuteur = Oeuvre & {
  auteur: Pick<Auteur, "id" | "slug" | "nom" | "prenom"> | null;
};

function clientPublic() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const CHAMPS_OEUVRE =
  "id, slug, titre, auteur_id, annee, siecle, region, genre, resume, extrait, texte_integral, langue, image_url, created_at";

export const listerAuteurs = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await clientPublic()
    .from("auteurs")
    .select("*")
    .order("nom", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Auteur[];
});

export const listerOeuvres = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await clientPublic()
    .from("oeuvres")
    .select(`${CHAMPS_OEUVRE}, auteur:auteurs(id, slug, nom, prenom)`)
    .order("titre", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as OeuvreAvecAuteur[];
});

export const chargerCatalogue = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = clientPublic();
  const [auteurs, oeuvres] = await Promise.all([
    supabase.from("auteurs").select("*").order("nom"),
    supabase
      .from("oeuvres")
      .select(`${CHAMPS_OEUVRE}, auteur:auteurs(id, slug, nom, prenom)`)
      .order("titre"),
  ]);
  if (auteurs.error) throw new Error(auteurs.error.message);
  if (oeuvres.error) throw new Error(oeuvres.error.message);
  return {
    auteurs: (auteurs.data ?? []) as Auteur[],
    oeuvres: (oeuvres.data ?? []) as unknown as OeuvreAvecAuteur[],
  };
});

export const obtenirAuteur = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const supabase = clientPublic();
    const { data: auteur, error } = await supabase
      .from("auteurs")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!auteur) return null;
    const { data: oeuvres, error: e2 } = await supabase
      .from("oeuvres")
      .select(CHAMPS_OEUVRE)
      .eq("auteur_id", auteur.id)
      .order("annee", { ascending: true });
    if (e2) throw new Error(e2.message);
    return { auteur: auteur as Auteur, oeuvres: (oeuvres ?? []) as Oeuvre[] };
  });

export const obtenirOeuvre = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { data: oeuvre, error } = await clientPublic()
      .from("oeuvres")
      .select(`${CHAMPS_OEUVRE}, auteur:auteurs(id, slug, nom, prenom)`)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (oeuvre ?? null) as unknown as OeuvreAvecAuteur | null;
  });
