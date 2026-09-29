import { createFileRoute, Link } from "@tanstack/react-router";
import { REGIONS, NOM_SITE } from "@/lib/arpitan";

export const Route = createFileRoute("/langue")({
  head: () => ({
    meta: [
      { title: `La langue arpitane (francoprovençal) — ${NOM_SITE}` },
      {
        name: "description",
        content:
          "Histoire, aire géographique et situation actuelle de l'arpitan, aussi appelé francoprovençal : Savoie, Val d'Aoste, Lyonnais, Suisse romande.",
      },
      { property: "og:title", content: "La langue arpitane (francoprovençal)" },
      {
        property: "og:description",
        content: "Histoire, aire géographique et situation actuelle de la langue arpitane.",
      },
    ],
  }),
  component: PageLangue,
});

/** Positions indicatives des aires linguistiques (carte stylisée, non géodésique). */
const POINTS: Record<string, { x: number; y: number }> = {
  "Franche-Comté": { x: 150, y: 60 },
  Bresse: { x: 120, y: 140 },
  "Suisse Romande": { x: 300, y: 100 },
  Lyonnais: { x: 120, y: 215 },
  Savoie: { x: 240, y: 190 },
  "Val d'Aoste": { x: 330, y: 250 },
  Forez: { x: 60, y: 255 },
  Dauphiné: { x: 195, y: 300 },
};

function PageLangue() {
  return (
    <div className="conteneur py-14">
      <p className="text-sm uppercase tracking-[0.2em] text-sage">La langue</p>
      <h1 className="titre-page mt-3 max-w-3xl">
        L'arpitan, une langue romane entre Alpes et Rhône
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div className="prose-litteraire max-w-prose">
          <h2 className="text-2xl">Une histoire longue et discrète</h2>
          <p className="mt-3 text-muted-foreground">
            L'arpitan, ou francoprovençal, est une langue romane née du latin parlé dans la région
            de Lyon et des Alpes du Nord. Distincte du français comme de l'occitan, elle est
            identifiée et nommée au XIX<sup>e</sup> siècle par le linguiste Graziadio Isaia Ascoli,
            qui remarque qu'elle combine des traits des deux domaines sans se réduire à aucun.
          </p>
          <p className="text-muted-foreground">
            Dès le XIII<sup>e</sup> siècle, elle est une langue d'écriture : Marguerite d'Oingt,
            prieure chartreuse du Lyonnais, y compose des textes mystiques qui comptent parmi les
            plus anciens témoignages littéraires de la langue. Suivront des siècles de chansons, de
            noëls, de contes, de théâtre paysan et de poésie, du Val d'Aoste à la Suisse romande.
          </p>

          <h2 className="mt-10 text-2xl">La situation aujourd'hui</h2>
          <p className="mt-3 text-muted-foreground">
            L'arpitan est classé comme langue en danger. Il reste vivant surtout au Val d'Aoste, où
            il bénéficie d'une reconnaissance et d'un enseignement, et dans de nombreuses vallées de
            Savoie, du Valais, de Fribourg ou du Lyonnais, porté par des associations, des
            conteurs, des chorales et des chercheurs. Une orthographe commune, l'ORB (orthographe de
            référence B), permet aujourd'hui d'écrire la langue par-delà la diversité des graphies
            locales.
          </p>

          <h2 id="pourquoi" className="mt-10 text-2xl">
            Pourquoi « arpitan » ou « francoprovençal » ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            « Francoprovençal » est le nom scientifique, forgé par Ascoli. Il décrit bien la
            position de la langue entre domaine d'oïl et domaine d'oc, mais il induit souvent en
            erreur : la langue n'est ni un mélange de français, ni un dialecte du provençal.
          </p>
          <p className="text-muted-foreground">
            « Arpitan », formé à partir de la racine alpine <em>arp-</em> (l'alpage), est apparu
            dans les années 1970 comme un nom propre à la langue et à ses locuteurs. Les deux termes
            désignent la même réalité ; ce site les emploie ensemble, par clarté envers les
            chercheurs comme envers le grand public.
          </p>
        </div>

        <aside id="aire">
          <h2 className="text-2xl">L'aire arpitane</h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            Carte indicative. Choisissez une région pour voir les œuvres correspondantes.
          </p>
          <div className="carte-douce mt-5 p-4">
            <svg
              viewBox="0 0 400 360"
              role="img"
              aria-label="Carte stylisée de l'aire arpitane"
              className="h-auto w-full"
            >
              <path
                d="M150 20 C250 10 350 60 360 150 C370 250 300 340 200 345 C100 350 30 290 30 200 C30 110 70 30 150 20 Z"
                fill="var(--color-parchemin)"
                stroke="var(--color-border)"
                strokeWidth="2"
              />
              {Object.entries(POINTS).map(([region, p]) => (
                <circle
                  key={region}
                  cx={p.x}
                  cy={p.y}
                  r="7"
                  fill="var(--color-sage)"
                  opacity="0.75"
                />
              ))}
            </svg>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <li key={region}>
                <Link
                  to="/bibliotheque"
                  search={{ region }}
                  className="inline-block rounded-full border border-input px-4 py-2 text-[0.95rem] transition-colors hover:border-primary hover:text-primary"
                >
                  {region}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
