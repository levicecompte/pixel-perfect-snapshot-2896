import { createFileRoute, Link } from "@tanstack/react-router";
import { EMAIL_CONTACT, NOM_SITE } from "@/lib/arpitan";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${NOM_SITE}` },
      {
        name: "description",
        content:
          "Contacter le site Littérature Arpitane : signaler un texte, proposer un auteur, corriger une fiche.",
      },
      { property: "og:title", content: `Contact — ${NOM_SITE}` },
      {
        property: "og:description",
        content: "Proposer un texte, signaler une correction, échanger autour de l'arpitan.",
      },
    ],
  }),
  component: PageContact,
});

function PageContact() {
  return (
    <div className="conteneur max-w-3xl py-14">
      <p className="text-sm uppercase tracking-[0.2em] text-sage">Écrire</p>
      <h1 className="titre-page mt-3">Contact</h1>
      <p className="prose-litteraire mt-5 text-muted-foreground">
        Ce site est un travail de collecte et de transmission. Chaque relecture, chaque texte
        retrouvé dans une armoire de famille, chaque précision d'un chercheur le rend plus juste.
        N'hésitez pas à écrire, même pour une simple remarque.
      </p>

      <div className="carte-douce mt-10 p-8 text-center">
        <p className="text-muted-foreground">Adresse de contact</p>
        <a
          href={`mailto:${EMAIL_CONTACT}`}
          className="mt-3 inline-block break-all font-serif text-2xl text-primary underline underline-offset-8"
        >
          {EMAIL_CONTACT}
        </a>
        <p className="mt-5 text-[0.95rem] text-muted-foreground">
          Réponse en général sous quelques jours.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-parchemin p-6">
          <h2 className="text-xl">Proposer un auteur ou une œuvre</h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            Indiquez le nom, la région, le siècle et, si possible, la source du texte.
          </p>
        </div>
        <div className="rounded-2xl bg-parchemin p-6">
          <h2 className="text-xl">Signaler une erreur</h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            Précisez la page concernée : les fiches sont corrigées rapidement.
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Voir aussi les{" "}
        <Link to="/mentions-legales" className="lien-sobre">
          mentions légales
        </Link>
        .
      </p>
    </div>
  );
}
