import { createFileRoute, Link } from "@tanstack/react-router";
import { listerAuteurs } from "@/lib/catalogue.functions";
import { NOM_SITE, dates, nomComplet } from "@/lib/arpitan";

export const Route = createFileRoute("/auteurs")({
  loader: () => listerAuteurs(),
  head: () => ({
    meta: [
      { title: `Auteurs de langue arpitane — ${NOM_SITE}` },
      {
        name: "description",
        content:
          "Répertoire des auteurs de langue arpitane (francoprovençale) : biographies, siècles, régions et œuvres.",
      },
      { property: "og:title", content: "Auteurs de langue arpitane" },
      {
        property: "og:description",
        content: "Répertoire des auteurs francoprovençaux : biographies, siècles et régions.",
      },
    ],
  }),
  component: PageAuteurs,
});

function initiales(prenom: string | null, nom: string) {
  return `${(prenom ?? nom).charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

function PageAuteurs() {
  const auteurs = Route.useLoaderData();

  return (
    <div className="conteneur py-14">
      <p className="text-sm uppercase tracking-[0.2em] text-sage">Répertoire</p>
      <h1 className="titre-page mt-3">Auteurs</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Les voix qui ont écrit en arpitan, des premiers textes médiévaux aux conteurs
        contemporains. {auteurs.length} auteurs recensés.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {auteurs.map((a) => (
          <Link
            key={a.id}
            to="/auteur/$slug"
            params={{ slug: a.slug }}
            className="carte-douce flex gap-4 p-6"
          >
            {a.photo_url ? (
              <img
                src={a.photo_url}
                alt={nomComplet(a)}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-lg text-accent-foreground"
              >
                {initiales(a.prenom, a.nom)}
              </span>
            )}
            <span className="min-w-0">
              <span className="block font-serif text-lg leading-snug">{nomComplet(a)}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{dates(a)}</span>
              <span className="mt-2 flex flex-wrap gap-2 text-xs">
                {a.siecle && (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                    {a.siecle}
                  </span>
                )}
                {a.region && (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                    {a.region}
                  </span>
                )}
                {a.statut === "majeur" && (
                  <span className="rounded-full bg-sage px-2.5 py-1 text-sage-foreground">
                    Auteur majeur
                  </span>
                )}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {auteurs.length === 0 && (
        <p className="mt-10 text-muted-foreground">Aucun auteur n'a encore été ajouté.</p>
      )}
    </div>
  );
}
