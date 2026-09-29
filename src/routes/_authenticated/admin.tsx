import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GENRES, NOM_SITE, REGIONS, SIECLES, STATUTS, nomComplet, slugifier } from "@/lib/arpitan";
import type { Auteur, Oeuvre } from "@/lib/catalogue.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Gestion du site — ${NOM_SITE}` },
      { name: "description", content: "Ajouter, modifier et supprimer les auteurs et les œuvres." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Gestion du site — ${NOM_SITE}` },
      { property: "og:description", content: "Espace de gestion réservé." },
    ],
  }),
  component: Admin,
});

const champ = "mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg";
const etiquette = "block text-lg font-medium";
const bloc = "mt-6";

type FormAuteur = {
  id?: string;
  nom: string;
  prenom: string;
  annee_naissance: string;
  annee_deces: string;
  siecle: string;
  region: string;
  biographie: string;
  photo_url: string;
  statut: string;
};

type FormOeuvre = {
  id?: string;
  titre: string;
  auteur_id: string;
  annee: string;
  siecle: string;
  region: string;
  genre: string;
  resume: string;
  extrait: string;
  texte_integral: string;
  langue: string;
  image_url: string;
};

const AUTEUR_VIDE: FormAuteur = {
  nom: "",
  prenom: "",
  annee_naissance: "",
  annee_deces: "",
  siecle: "",
  region: "",
  biographie: "",
  photo_url: "",
  statut: "à découvrir",
};

const OEUVRE_VIDE: FormOeuvre = {
  titre: "",
  auteur_id: "",
  annee: "",
  siecle: "",
  region: "",
  genre: "",
  resume: "",
  extrait: "",
  texte_integral: "",
  langue: "",
  image_url: "",
};

function nombre(v: string): number | null {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function vide(v: string): string | null {
  return v.trim() === "" ? null : v.trim();
}

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [onglet, setOnglet] = useState<"auteurs" | "oeuvres">("auteurs");
  const [formAuteur, setFormAuteur] = useState<FormAuteur>(AUTEUR_VIDE);
  const [formOeuvre, setFormOeuvre] = useState<FormOeuvre>(OEUVRE_VIDE);

  const auteurs = useQuery({
    queryKey: ["admin", "auteurs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("auteurs").select("*").order("nom");
      if (error) throw new Error(error.message);
      return (data ?? []) as Auteur[];
    },
  });

  const oeuvres = useQuery({
    queryKey: ["admin", "oeuvres"],
    queryFn: async () => {
      const { data, error } = await supabase.from("oeuvres").select("*").order("titre");
      if (error) throw new Error(error.message);
      return (data ?? []) as Oeuvre[];
    },
  });

  const enregistrerAuteur = useMutation({
    mutationFn: async (f: FormAuteur) => {
      const valeurs = {
        slug: slugifier(`${f.prenom} ${f.nom}`) || slugifier(f.nom),
        nom: f.nom.trim(),
        prenom: vide(f.prenom),
        annee_naissance: nombre(f.annee_naissance),
        annee_deces: nombre(f.annee_deces),
        siecle: vide(f.siecle),
        region: vide(f.region),
        biographie: vide(f.biographie),
        photo_url: vide(f.photo_url),
        statut: f.statut,
      };
      const { error } = f.id
        ? await supabase.from("auteurs").update(valeurs).eq("id", f.id)
        : await supabase.from("auteurs").insert(valeurs);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Auteur enregistré.");
      setFormAuteur(AUTEUR_VIDE);
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const supprimerAuteur = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("auteurs").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Auteur supprimé.");
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const enregistrerOeuvre = useMutation({
    mutationFn: async (f: FormOeuvre) => {
      const valeurs = {
        slug: slugifier(f.titre),
        titre: f.titre.trim(),
        auteur_id: vide(f.auteur_id),
        annee: nombre(f.annee),
        siecle: vide(f.siecle),
        region: vide(f.region),
        genre: vide(f.genre),
        resume: vide(f.resume),
        extrait: vide(f.extrait),
        texte_integral: vide(f.texte_integral),
        langue: vide(f.langue),
        image_url: vide(f.image_url),
      };
      const { error } = f.id
        ? await supabase.from("oeuvres").update(valeurs).eq("id", f.id)
        : await supabase.from("oeuvres").insert(valeurs);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Œuvre enregistrée.");
      setFormOeuvre(OEUVRE_VIDE);
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const supprimerOeuvre = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("oeuvres").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Œuvre supprimée.");
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function deconnexion() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function editerAuteur(a: Auteur) {
    setOnglet("auteurs");
    setFormAuteur({
      id: a.id,
      nom: a.nom,
      prenom: a.prenom ?? "",
      annee_naissance: a.annee_naissance ? String(a.annee_naissance) : "",
      annee_deces: a.annee_deces ? String(a.annee_deces) : "",
      siecle: a.siecle ?? "",
      region: a.region ?? "",
      biographie: a.biographie ?? "",
      photo_url: a.photo_url ?? "",
      statut: a.statut,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editerOeuvre(o: Oeuvre) {
    setOnglet("oeuvres");
    setFormOeuvre({
      id: o.id,
      titre: o.titre,
      auteur_id: o.auteur_id ?? "",
      annee: o.annee ? String(o.annee) : "",
      siecle: o.siecle ?? "",
      region: o.region ?? "",
      genre: o.genre ?? "",
      resume: o.resume ?? "",
      extrait: o.extrait ?? "",
      texte_integral: o.texte_integral ?? "",
      langue: o.langue ?? "",
      image_url: o.image_url ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const boutonOnglet = (actif: boolean) =>
    `rounded-xl px-7 py-4 text-lg ${actif ? "bg-primary text-primary-foreground" : "border border-input bg-card"}`;

  return (
    <div className="conteneur py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="titre-page">Gestion du site</h1>
        <button type="button" onClick={deconnexion} className="rounded-xl border border-input px-6 py-3">
          Se déconnecter
        </button>
      </div>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Remplissez un formulaire et appuyez sur le grand bouton « Enregistrer ». Pour corriger une
        fiche existante, cliquez sur « Modifier » dans la liste du bas.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className={boutonOnglet(onglet === "auteurs")} onClick={() => setOnglet("auteurs")}>
          Auteurs ({auteurs.data?.length ?? 0})
        </button>
        <button type="button" className={boutonOnglet(onglet === "oeuvres")} onClick={() => setOnglet("oeuvres")}>
          Œuvres ({oeuvres.data?.length ?? 0})
        </button>
      </div>

      {onglet === "auteurs" && (
        <section className="mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enregistrerAuteur.mutate(formAuteur);
            }}
            className="carte-douce p-7"
          >
            <h2 className="text-2xl">
              {formAuteur.id ? "Modifier un auteur" : "Ajouter un auteur"}
            </h2>

            <div className={bloc}>
              <label htmlFor="a-nom" className={etiquette}>
                Nom de famille (obligatoire)
              </label>
              <input
                id="a-nom"
                required
                className={champ}
                value={formAuteur.nom}
                onChange={(e) => setFormAuteur({ ...formAuteur, nom: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="a-prenom" className={etiquette}>
                Prénom
              </label>
              <input
                id="a-prenom"
                className={champ}
                value={formAuteur.prenom}
                onChange={(e) => setFormAuteur({ ...formAuteur, prenom: e.target.value })}
              />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="a-naissance" className={etiquette}>
                  Année de naissance
                </label>
                <input
                  id="a-naissance"
                  inputMode="numeric"
                  className={champ}
                  value={formAuteur.annee_naissance}
                  onChange={(e) => setFormAuteur({ ...formAuteur, annee_naissance: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="a-deces" className={etiquette}>
                  Année de décès
                </label>
                <input
                  id="a-deces"
                  inputMode="numeric"
                  className={champ}
                  value={formAuteur.annee_deces}
                  onChange={(e) => setFormAuteur({ ...formAuteur, annee_deces: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="a-siecle" className={etiquette}>
                  Siècle
                </label>
                <select
                  id="a-siecle"
                  className={champ}
                  value={formAuteur.siecle}
                  onChange={(e) => setFormAuteur({ ...formAuteur, siecle: e.target.value })}
                >
                  <option value="">— Choisir —</option>
                  {SIECLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="a-region" className={etiquette}>
                  Région
                </label>
                <select
                  id="a-region"
                  className={champ}
                  value={formAuteur.region}
                  onChange={(e) => setFormAuteur({ ...formAuteur, region: e.target.value })}
                >
                  <option value="">— Choisir —</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="a-statut" className={etiquette}>
                  Statut
                </label>
                <select
                  id="a-statut"
                  className={champ}
                  value={formAuteur.statut}
                  onChange={(e) => setFormAuteur({ ...formAuteur, statut: e.target.value })}
                >
                  {STATUTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={bloc}>
              <label htmlFor="a-bio" className={etiquette}>
                Biographie courte
              </label>
              <textarea
                id="a-bio"
                rows={6}
                className={champ}
                value={formAuteur.biographie}
                onChange={(e) => setFormAuteur({ ...formAuteur, biographie: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="a-photo" className={etiquette}>
                Adresse de la photo (lien internet)
              </label>
              <input
                id="a-photo"
                className={champ}
                placeholder="https://…"
                value={formAuteur.photo_url}
                onChange={(e) => setFormAuteur({ ...formAuteur, photo_url: e.target.value })}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={enregistrerAuteur.isPending}
                className="rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground disabled:opacity-60"
              >
                {enregistrerAuteur.isPending ? "Enregistrement…" : "Enregistrer l'auteur"}
              </button>
              {formAuteur.id && (
                <button
                  type="button"
                  onClick={() => setFormAuteur(AUTEUR_VIDE)}
                  className="rounded-xl border border-input px-8 py-4 text-lg"
                >
                  Annuler la modification
                </button>
              )}
            </div>
          </form>

          <h3 className="mt-12 text-2xl">Auteurs enregistrés</h3>
          <ul className="mt-4 space-y-3">
            {(auteurs.data ?? []).map((a) => (
              <li
                key={a.id}
                className="carte-douce flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-serif text-lg">{nomComplet(a)}</p>
                  <p className="text-sm text-muted-foreground">
                    {[a.siecle, a.region, a.statut].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => editerAuteur(a)}
                    className="rounded-xl border border-input px-6 py-3"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Supprimer définitivement ${nomComplet(a)} ?`)) {
                        supprimerAuteur.mutate(a.id);
                      }
                    }}
                    className="rounded-xl border border-destructive px-6 py-3 text-destructive"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {onglet === "oeuvres" && (
        <section className="mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enregistrerOeuvre.mutate(formOeuvre);
            }}
            className="carte-douce p-7"
          >
            <h2 className="text-2xl">{formOeuvre.id ? "Modifier une œuvre" : "Ajouter une œuvre"}</h2>

            <div className={bloc}>
              <label htmlFor="o-titre" className={etiquette}>
                Titre (obligatoire)
              </label>
              <input
                id="o-titre"
                required
                className={champ}
                value={formOeuvre.titre}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, titre: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="o-auteur" className={etiquette}>
                Auteur
              </label>
              <select
                id="o-auteur"
                className={champ}
                value={formOeuvre.auteur_id}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, auteur_id: e.target.value })}
              >
                <option value="">— Auteur inconnu —</option>
                {(auteurs.data ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {nomComplet(a)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="o-annee" className={etiquette}>
                  Année
                </label>
                <input
                  id="o-annee"
                  inputMode="numeric"
                  className={champ}
                  value={formOeuvre.annee}
                  onChange={(e) => setFormOeuvre({ ...formOeuvre, annee: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="o-siecle" className={etiquette}>
                  Siècle
                </label>
                <select
                  id="o-siecle"
                  className={champ}
                  value={formOeuvre.siecle}
                  onChange={(e) => setFormOeuvre({ ...formOeuvre, siecle: e.target.value })}
                >
                  <option value="">— Choisir —</option>
                  {SIECLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="o-region" className={etiquette}>
                  Région
                </label>
                <select
                  id="o-region"
                  className={champ}
                  value={formOeuvre.region}
                  onChange={(e) => setFormOeuvre({ ...formOeuvre, region: e.target.value })}
                >
                  <option value="">— Choisir —</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="o-genre" className={etiquette}>
                  Genre littéraire
                </label>
                <select
                  id="o-genre"
                  className={champ}
                  value={formOeuvre.genre}
                  onChange={(e) => setFormOeuvre({ ...formOeuvre, genre: e.target.value })}
                >
                  <option value="">— Choisir —</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={bloc}>
              <label htmlFor="o-langue" className={etiquette}>
                Langue / graphie
              </label>
              <input
                id="o-langue"
                className={champ}
                placeholder="ORB (orthographe de référence) ou graphie locale"
                value={formOeuvre.langue}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, langue: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="o-resume" className={etiquette}>
                Résumé
              </label>
              <textarea
                id="o-resume"
                rows={4}
                className={champ}
                value={formOeuvre.resume}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, resume: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="o-extrait" className={etiquette}>
                Extrait
              </label>
              <textarea
                id="o-extrait"
                rows={4}
                className={champ}
                value={formOeuvre.extrait}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, extrait: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="o-texte" className={etiquette}>
                Texte intégral (uniquement si le texte est dans le domaine public)
              </label>
              <textarea
                id="o-texte"
                rows={10}
                className={champ}
                value={formOeuvre.texte_integral}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, texte_integral: e.target.value })}
              />
            </div>

            <div className={bloc}>
              <label htmlFor="o-image" className={etiquette}>
                Adresse de l'image de couverture (lien internet)
              </label>
              <input
                id="o-image"
                className={champ}
                placeholder="https://…"
                value={formOeuvre.image_url}
                onChange={(e) => setFormOeuvre({ ...formOeuvre, image_url: e.target.value })}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={enregistrerOeuvre.isPending}
                className="rounded-xl bg-primary px-8 py-4 text-lg text-primary-foreground disabled:opacity-60"
              >
                {enregistrerOeuvre.isPending ? "Enregistrement…" : "Enregistrer l'œuvre"}
              </button>
              {formOeuvre.id && (
                <button
                  type="button"
                  onClick={() => setFormOeuvre(OEUVRE_VIDE)}
                  className="rounded-xl border border-input px-8 py-4 text-lg"
                >
                  Annuler la modification
                </button>
              )}
            </div>
          </form>

          <h3 className="mt-12 text-2xl">Œuvres enregistrées</h3>
          <ul className="mt-4 space-y-3">
            {(oeuvres.data ?? []).map((o) => (
              <li
                key={o.id}
                className="carte-douce flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-serif text-lg">{o.titre}</p>
                  <p className="text-sm text-muted-foreground">
                    {[o.genre, o.annee, o.region].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => editerOeuvre(o)}
                    className="rounded-xl border border-input px-6 py-3"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Supprimer définitivement « ${o.titre} » ?`)) {
                        supprimerOeuvre.mutate(o.id);
                      }
                    }}
                    className="rounded-xl border border-destructive px-6 py-3 text-destructive"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-sm text-muted-foreground">
        <Link to="/" className="lien-sobre">
          ← Retour au site public
        </Link>
      </p>
    </div>
  );
}
