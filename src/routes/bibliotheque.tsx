import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { chargerCatalogue } from "@/lib/catalogue.functions";
import { GENRES, NOM_SITE, REGIONS, SIECLES, nomComplet } from "@/lib/arpitan";

type Filtres = {
  q?: string | undefined;
  siecle?: string | undefined;
  region?: string | undefined;
  auteur?: string | undefined;
  oeuvre?: string | undefined;
  genre?: string | undefined;
};

function texte(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export const Route = createFileRoute("/bibliotheque")({
  validateSearch: (search: Record<string, unknown>): Filtres => ({
    q: texte(search["q"]),
    siecle: texte(search["siecle"]),
    region: texte(search["region"]),
    auteur: texte(search["auteur"]),
    oeuvre: texte(search["oeuvre"]),
    genre: texte(search["genre"]),
  }),
  loader: () => chargerCatalogue(),
  head: () => ({
    meta: [
      { title: `Bibliothèque arpitane — recherche et filtres — ${NOM_SITE}` },
      {
        name: "description",
        content:
          "Cherchez une œuvre arpitane par mot-clé et filtrez par siècle, région, auteur, œuvre et genre littéraire.",
      },
      { property: "og:title", content: "Bibliothèque arpitane — explorer les œuvres" },
      {
        property: "og:description",
        content: "Recherche par mot-clé et cinq filtres combinables sur toute la collection.",
      },
    ],
  }),
  component: Bibliotheque,
});

function Bibliotheque() {
  const { auteurs, oeuvres } = Route.useLoaderData();
  const filtres = Route.useSearch();
  const navigate = useNavigate({ from: "/bibliotheque" });

  function definir(cle: keyof Filtres, valeur: string) {
    navigate({
      search: (prec: Filtres) => ({ ...prec, [cle]: valeur === "" ? undefined : valeur }),
    });
  }

  const resultats = useMemo(() => {
    const q = (filtres.q ?? "").trim().toLowerCase();
    return oeuvres.filter((o) => {
      if (filtres.siecle && o.siecle !== filtres.siecle) return false;
      if (filtres.region && o.region !== filtres.region) return false;
      if (filtres.genre && o.genre !== filtres.genre) return false;
      if (filtres.auteur && o.auteur?.slug !== filtres.auteur) return false;
      if (filtres.oeuvre && o.slug !== filtres.oeuvre) return false;
      if (!q) return true;
      const champs = [
        o.titre,
        o.resume,
        o.extrait,
        o.genre,
        o.region,
        o.siecle,
        o.langue,
        o.auteur ? nomComplet(o.auteur) : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return champs.includes(q);
    });
  }, [oeuvres, filtres]);

  const actif =
    filtres.q || filtres.siecle || filtres.region || filtres.auteur || filtres.oeuvre || filtres.genre;

  const classeSelect =
    "w-full rounded-xl border border-input bg-card px-3 py-3 text-[0.95rem] focus-visible:border-primary";

  return (
    <div className="conteneur py-14">
      <p className="text-sm uppercase tracking-[0.2em] text-sage">Explorer</p>
      <h1 className="titre-page mt-3">Bibliothèque</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Le cœur du site : cherchez un mot, puis affinez avec les cinq filtres. Les résultats se
        mettent à jour immédiatement.
      </p>

      <div className="carte-douce mt-10 p-6">
        <label htmlFor="recherche" className="block text-[0.95rem] font-medium">
          Rechercher un mot-clé
        </label>
        <input
          id="recherche"
          type="search"
          value={filtres.q ?? ""}
          onChange={(e) => definir("q", e.target.value)}
          placeholder="Titre, auteur, thème, extrait…"
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="f-siecle" className="block text-sm font-medium">
              Siècle
            </label>
            <select
              id="f-siecle"
              className={`mt-1 ${classeSelect}`}
              value={filtres.siecle ?? ""}
              onChange={(e) => definir("siecle", e.target.value)}
            >
              <option value="">Tous les siècles</option>
              {SIECLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-region" className="block text-sm font-medium">
              Région
            </label>
            <select
              id="f-region"
              className={`mt-1 ${classeSelect}`}
              value={filtres.region ?? ""}
              onChange={(e) => definir("region", e.target.value)}
            >
              <option value="">Toutes les régions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-auteur" className="block text-sm font-medium">
              Auteur
            </label>
            <select
              id="f-auteur"
              className={`mt-1 ${classeSelect}`}
              value={filtres.auteur ?? ""}
              onChange={(e) => definir("auteur", e.target.value)}
            >
              <option value="">Tous les auteurs</option>
              {auteurs.map((a) => (
                <option key={a.id} value={a.slug}>
                  {nomComplet(a)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-oeuvre" className="block text-sm font-medium">
              Œuvre
            </label>
            <select
              id="f-oeuvre"
              className={`mt-1 ${classeSelect}`}
              value={filtres.oeuvre ?? ""}
              onChange={(e) => definir("oeuvre", e.target.value)}
            >
              <option value="">Toutes les œuvres</option>
              {oeuvres.map((o) => (
                <option key={o.id} value={o.slug}>
                  {o.titre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-genre" className="block text-sm font-medium">
              Genre littéraire
            </label>
            <select
              id="f-genre"
              className={`mt-1 ${classeSelect}`}
              value={filtres.genre ?? ""}
              onChange={(e) => definir("genre", e.target.value)}
            >
              <option value="">Tous les genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {actif && (
          <button
            type="button"
            onClick={() => navigate({ search: {} })}
            className="mt-5 rounded-full border border-input px-5 py-2 text-[0.95rem]"
          >
            Effacer tous les filtres
          </button>
        )}
      </div>

      <p aria-live="polite" className="mt-8 font-serif text-xl">
        {resultats.length} œuvre{resultats.length > 1 ? "s" : ""} trouvée
        {resultats.length > 1 ? "s" : ""}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resultats.map((o) => (
          <Link
            key={o.id}
            to="/oeuvre/$slug"
            params={{ slug: o.slug }}
            className="carte-douce block p-6"
          >
            <span className="text-xs uppercase tracking-widest text-sage">{o.genre}</span>
            <span className="mt-2 block font-serif text-lg leading-snug">{o.titre}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {[o.auteur ? nomComplet(o.auteur) : "Anonyme", o.annee, o.region]
                .filter(Boolean)
                .join(" · ")}
            </span>
            {o.resume && (
              <span className="mt-3 block line-clamp-3 text-[0.95rem] text-muted-foreground">
                {o.resume}
              </span>
            )}
          </Link>
        ))}
      </div>

      {resultats.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          Aucune œuvre ne correspond à cette recherche. Essayez d'élargir les filtres.
        </p>
      )}
    </div>
  );
}
