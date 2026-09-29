import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { chargerCatalogue } from "@/lib/catalogue.functions";
import { EMAIL_CONTACT, NOM_SITE, nomComplet } from "@/lib/arpitan";
import hero from "@/assets/hero-arpitan.jpg";

export const Route = createFileRoute("/")({
  loader: () => chargerCatalogue(),
  head: () => ({
    meta: [
      { title: `${NOM_SITE} — La littérature arpitane, une mémoire vivante` },
      {
        name: "description",
        content:
          "Auteurs, œuvres et extraits de la littérature arpitane (francoprovençale) : Savoie, Val d'Aoste, Lyonnais, Bresse, Suisse romande.",
      },
      { property: "og:title", content: "La littérature arpitane, une mémoire vivante" },
      {
        property: "og:description",
        content:
          "Un site patrimonial pour découvrir la littérature francoprovençale : auteurs, œuvres, bibliothèque de recherche.",
      },
    ],
  }),
  component: Accueil,
});

function Accueil() {
  const { auteurs, oeuvres } = Route.useLoaderData();
  const navigate = useNavigate();

  function lireAuHasard() {
    if (oeuvres.length === 0) return;
    const tirage = oeuvres[Math.floor(Math.random() * oeuvres.length)]!;
    navigate({ to: "/oeuvre/$slug", params: { slug: tirage.slug } });
  }

  return (
    <>
      <section className="conteneur grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sage">Patrimoine francoprovençal</p>
          <h1 className="titre-page mt-4">La littérature arpitane, une mémoire vivante</h1>
          <p className="prose-litteraire mt-6 max-w-prose text-muted-foreground">
            De Marguerite d'Oingt aux conteurs du XX<sup>e</sup> siècle, l'arpitan — ou
            francoprovençal — a porté une littérature riche et souvent oubliée. Ce site rassemble
            ses auteurs, ses œuvres et ses textes, pour les lire, les comprendre et les transmettre.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/bibliotheque"
              className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorer la bibliothèque
            </Link>
            <Link to="/langue" className="rounded-full border border-input px-6 py-3">
              Qu'est-ce que l'arpitan ?
            </Link>
          </div>
        </div>
        <img
          src={hero}
          alt="Manuscrit ancien posé près de fleurs séchées, lumière douce"
          width={1600}
          height={1000}
          className="w-full rounded-3xl object-cover shadow-sm"
        />
      </section>

      <section className="conteneur grid gap-5 pb-6 md:grid-cols-3">
        <Link to="/auteurs" className="carte-douce block p-7">
          <span className="text-sm uppercase tracking-widest text-sage">01</span>
          <h2 className="mt-3 text-xl">Découvrir un auteur</h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            {auteurs.length} auteurs recensés, des figures majeures aux voix à redécouvrir.
          </p>
        </Link>
        <Link to="/langue" hash="aire" className="carte-douce block p-7">
          <span className="text-sm uppercase tracking-widest text-sage">02</span>
          <h2 className="mt-3 text-xl">Explorer une région</h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            Savoie, Val d'Aoste, Lyonnais, Bresse, Suisse romande : parcourez l'aire arpitane.
          </p>
        </Link>
        <button type="button" onClick={lireAuHasard} className="carte-douce block p-7 text-left">
          <span className="text-sm uppercase tracking-widest text-sage">03</span>
          <h2 className="mt-3 text-xl">Lire au hasard</h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            Laissez le site vous proposer un texte parmi {oeuvres.length} œuvres.
          </p>
        </button>
      </section>

      {oeuvres.length > 0 && (
        <section className="conteneur py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl">Quelques œuvres</h2>
            <Link to="/oeuvres" className="lien-sobre text-[0.95rem]">
              Voir toutes les œuvres
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {oeuvres.slice(0, 3).map((o) => (
              <Link
                key={o.id}
                to="/oeuvre/$slug"
                params={{ slug: o.slug }}
                className="carte-douce block p-6"
              >
                <p className="text-xs uppercase tracking-widest text-sage">{o.genre}</p>
                <h3 className="mt-2 text-lg">{o.titre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {o.auteur ? nomComplet(o.auteur) : "Anonyme"}
                  {o.annee ? ` · ${o.annee}` : ""}
                </p>
                {o.resume && (
                  <p className="mt-3 line-clamp-3 text-[0.95rem] text-muted-foreground">
                    {o.resume}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="conteneur pb-8">
        <div className="rounded-3xl bg-parchemin p-8 text-center md:p-12">
          <h2 className="text-2xl">Un texte, une correction, une suggestion ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Ce site vit grâce aux lecteurs, aux chercheurs et aux familles qui conservent des
            textes. Écrivez-nous.
          </p>
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-lg text-primary-foreground"
          >
            {EMAIL_CONTACT}
          </a>
        </div>
      </section>
    </>
  );
}
