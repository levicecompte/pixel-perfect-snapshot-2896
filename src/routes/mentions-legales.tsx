import { createFileRoute } from "@tanstack/react-router";
import { EMAIL_CONTACT, NOM_SITE } from "@/lib/arpitan";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: `Mentions légales — ${NOM_SITE}` },
      {
        name: "description",
        content: `Mentions légales, hébergement, droits d'auteur et données personnelles du site ${NOM_SITE}.`,
      },
      { property: "og:title", content: `Mentions légales — ${NOM_SITE}` },
      { property: "og:description", content: "Mentions légales et informations éditoriales." },
    ],
  }),
  component: Mentions,
});

function Mentions() {
  return (
    <div className="conteneur max-w-3xl py-14">
      <h1 className="titre-page">Mentions légales</h1>

      <section className="prose-litteraire mt-8 text-muted-foreground">
        <h2 className="text-2xl text-foreground">Éditeur du site</h2>
        <p>
          {NOM_SITE} — site patrimonial et culturel non commercial consacré à la littérature
          francoprovençale. Contact :{" "}
          <a href={`mailto:${EMAIL_CONTACT}`} className="lien-sobre">
            {EMAIL_CONTACT}
          </a>
          .
        </p>

        <h2 className="mt-8 text-2xl text-foreground">Hébergement</h2>
        <p>Le site est hébergé sur une infrastructure d'hébergement web mutualisée.</p>

        <h2 className="mt-8 text-2xl text-foreground">Droits d'auteur</h2>
        <p>
          Les textes intégraux publiés sur ce site le sont uniquement lorsqu'ils appartiennent au
          domaine public. Les biographies, résumés et présentations sont rédigés pour le site. Toute
          reproduction est autorisée à des fins pédagogiques et de recherche, sous réserve de citer
          la source.
        </p>
        <p>
          Si vous estimez qu'un contenu porte atteinte à vos droits, écrivez-nous : il sera retiré
          sans délai.
        </p>

        <h2 className="mt-8 text-2xl text-foreground">Données personnelles</h2>
        <p>
          Le site ne collecte aucune donnée personnelle des visiteurs et n'utilise pas de traceurs
          publicitaires. Les messages envoyés par courriel ne servent qu'à vous répondre.
        </p>
      </section>
    </div>
  );
}
