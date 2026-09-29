import { createFileRoute, Link } from "@tanstack/react-router";
import { listerOeuvres } from "@/lib/catalogue.functions";
import { NOM_SITE, nomComplet } from "@/lib/arpitan";

export const Route = createFileRoute("/oeuvres")({
  loader: () => listerOeuvres(),
  head: () => ({
    meta: [
      { title: `Œuvres de la littérature arpitane — ${NOM_SITE}` },
      {
        name: "description",
        content:
          "Poésies, contes, chansons, théâtre et textes religieux en langue arpitane : résumés, extraits et textes intégraux.",
      },
      { property: "og:title", content: "Œuvres de la littérature arpitane" },
      {
        property: "og:description",
        content: "Poésies, contes, chansons et textes en langue francoprovençale.",
      },
    ],
  }),
  component: PageOeuvres,
});

function PageOeuvres() {
  const oeuvres = Route.useLoaderData();

  return (
    <div className="conteneur py-14">
      <p className="text-sm uppercase tracking-[0.2em] text-sage">Catalogue</p>
      <h1 className="titre-page mt-3">Œuvres</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        {oeuvres.length} œuvres recensées. Pour filtrer par siècle, région ou genre, ouvrez la{" "}
        <Link to="/bibliotheque" className="lien-sobre">
          bibliothèque
        </Link>
        .
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {oeuvres.map((o) => (
          <Link
            key={o.id}
            to="/oeuvre/$slug"
            params={{ slug: o.slug }}
            className="carte-douce block overflow-hidden"
          >
            {o.image_url && (
              <img
                src={o.image_url}
                alt={o.titre}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
            )}
            <span className="block p-6">
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
            </span>
          </Link>
        ))}
      </div>

      {oeuvres.length === 0 && (
        <p className="mt-10 text-muted-foreground">Aucune œuvre n'a encore été ajoutée.</p>
      )}
    </div>
  );
}
