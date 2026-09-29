import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { obtenirOeuvre } from "@/lib/catalogue.functions";
import { NOM_SITE, nomComplet } from "@/lib/arpitan";

export const Route = createFileRoute("/oeuvre/$slug")({
  loader: async ({ params }) => {
    const oeuvre = await obtenirOeuvre({ data: { slug: params.slug } });
    if (!oeuvre) throw notFound();
    return oeuvre;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Œuvre introuvable — ${NOM_SITE}` }, { name: "robots", content: "noindex" }],
      };
    }
    const description =
      (loaderData.resume ?? "").slice(0, 180) ||
      `${loaderData.titre}, œuvre de la littérature arpitane.`;
    return {
      meta: [
        { title: `${loaderData.titre} — ${NOM_SITE}` },
        { name: "description", content: description },
        { property: "og:title", content: loaderData.titre },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
      ],
    };
  },
  component: FicheOeuvre,
});

function FicheOeuvre() {
  const o = Route.useLoaderData();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: o.titre,
    inLanguage: "frp",
    genre: o.genre ?? undefined,
    datePublished: o.annee ? String(o.annee) : undefined,
    abstract: o.resume ?? undefined,
    image: o.image_url ?? undefined,
    author: o.auteur ? { "@type": "Person", name: nomComplet(o.auteur) } : undefined,
  };

  return (
    <article className="conteneur py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Link to="/oeuvres" className="sans-impression lien-sobre text-[0.95rem]">
        ← Toutes les œuvres
      </Link>

      <header className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sage">{o.genre}</p>
          <h1 className="titre-page mt-3">{o.titre}</h1>
          <p className="mt-3 text-muted-foreground">
            {o.auteur ? (
              <Link to="/auteur/$slug" params={{ slug: o.auteur.slug }} className="lien-sobre">
                {nomComplet(o.auteur)}
              </Link>
            ) : (
              "Auteur inconnu"
            )}
            {[o.annee, o.siecle, o.region].filter(Boolean).length > 0 && " · "}
            {[o.annee, o.siecle, o.region].filter(Boolean).join(" · ")}
          </p>
          {o.langue && (
            <p className="mt-2 text-sm text-muted-foreground">Langue / graphie : {o.langue}</p>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="sans-impression mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground"
          >
            Télécharger en PDF
          </button>
        </div>
        {o.image_url && (
          <img
            src={o.image_url}
            alt={o.titre}
            className="w-full rounded-2xl object-cover md:w-64"
          />
        )}
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          {o.resume && (
            <section>
              <h2 className="text-2xl">Résumé</h2>
              <p className="prose-litteraire mt-3 max-w-prose text-muted-foreground">{o.resume}</p>
            </section>
          )}

          {o.texte_integral && (
            <section className="mt-10">
              <h2 className="text-2xl">Texte intégral</h2>
              <div className="prose-litteraire mt-4 max-w-prose whitespace-pre-line">
                {o.texte_integral}
              </div>
            </section>
          )}
        </div>

        {o.extrait && (
          <aside>
            <h2 className="text-2xl">Extrait</h2>
            <blockquote className="mt-4 rounded-2xl bg-parchemin p-7 font-serif text-lg italic leading-relaxed">
              « {o.extrait} »
            </blockquote>
          </aside>
        )}
      </div>
    </article>
  );
}
