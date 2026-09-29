import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { obtenirAuteur } from "@/lib/catalogue.functions";
import { NOM_SITE, dates, nomComplet } from "@/lib/arpitan";

export const Route = createFileRoute("/auteur/$slug")({
  loader: async ({ params }) => {
    const donnees = await obtenirAuteur({ data: { slug: params.slug } });
    if (!donnees) throw notFound();
    return donnees;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: `Auteur introuvable — ${NOM_SITE}` }, { name: "robots", content: "noindex" }] };
    }
    const nom = nomComplet(loaderData.auteur);
    const description = (loaderData.auteur.biographie ?? "").slice(0, 180) ||
      `Biographie et œuvres de ${nom}, auteur de langue arpitane.`;
    return {
      meta: [
        { title: `${nom} — ${NOM_SITE}` },
        { name: "description", content: description },
        { property: "og:title", content: `${nom} — auteur arpitan` },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: FicheAuteur,
});

function FicheAuteur() {
  const { auteur, oeuvres } = Route.useLoaderData();
  const nom = nomComplet(auteur);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: nom,
    description: auteur.biographie ?? undefined,
    birthDate: auteur.annee_naissance ? String(auteur.annee_naissance) : undefined,
    deathDate: auteur.annee_deces ? String(auteur.annee_deces) : undefined,
    knowsLanguage: "Francoprovençal (arpitan)",
    image: auteur.photo_url ?? undefined,
  };

  return (
    <article className="conteneur py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Link to="/auteurs" className="lien-sobre text-[0.95rem]">
        ← Tous les auteurs
      </Link>

      <header className="mt-6 flex flex-wrap items-center gap-6">
        {auteur.photo_url && (
          <img
            src={auteur.photo_url}
            alt={nom}
            className="h-28 w-28 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="titre-page">{nom}</h1>
          <p className="mt-2 text-muted-foreground">
            {[dates(auteur), auteur.siecle, auteur.region].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <section>
          <h2 className="text-2xl">Biographie</h2>
          <div className="prose-litteraire mt-4 max-w-prose text-muted-foreground">
            {(auteur.biographie ?? "Biographie à compléter.")
              .split("\n")
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl">Ses œuvres ({oeuvres.length})</h2>
          <ul className="mt-4 space-y-4">
            {oeuvres.map((o) => (
              <li key={o.id}>
                <Link to="/oeuvre/$slug" params={{ slug: o.slug }} className="carte-douce block p-5">
                  <span className="block font-serif text-lg">{o.titre}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {[o.genre, o.annee].filter(Boolean).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
            {oeuvres.length === 0 && (
              <li className="text-muted-foreground">Aucune œuvre enregistrée pour cet auteur.</li>
            )}
          </ul>
        </section>
      </div>
    </article>
  );
}
