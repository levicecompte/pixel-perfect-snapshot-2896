import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { EMAIL_CONTACT, NOM_SITE, SOUS_TITRE } from "../lib/arpitan";
import { Toaster } from "@/components/ui/sonner";

const LIENS = [
  { to: "/", label: "Accueil" },
  { to: "/langue", label: "La Langue Arpitane" },
  { to: "/auteurs", label: "Auteurs" },
  { to: "/oeuvres", label: "Œuvres" },
  { to: "/bibliotheque", label: "Bibliothèque" },
  { to: "/contact", label: "Contact" },
] as const;

function EnTete() {
  return (
    <header className="sans-impression border-b border-border bg-background/95 backdrop-blur">
      <div className="conteneur flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="group inline-flex flex-col">
          <span className="font-serif text-xl leading-tight text-foreground">{NOM_SITE}</span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {SOUS_TITRE}
          </span>
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LIENS.map((lien) => (
              <li key={lien.to}>
                <Link
                  to={lien.to}
                  activeOptions={{ exact: lien.to === "/" }}
                  className="rounded-md py-1 text-[0.95rem] text-muted-foreground transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary font-medium" }}
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function PiedDePage() {
  return (
    <footer className="sans-impression mt-24 border-t border-border bg-parchemin">
      <div className="conteneur grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg">{NOM_SITE}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Une mémoire vivante de la littérature francoprovençale, de la Savoie au Val d'Aoste.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Parcourir</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {LIENS.slice(1).map((lien) => (
              <li key={lien.to}>
                <Link to={lien.to} className="hover:text-primary">
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Nous écrire</p>
          <a href={`mailto:${EMAIL_CONTACT}`} className="lien-sobre mt-2 inline-block text-sm">
            {EMAIL_CONTACT}
          </a>
          <p className="mt-4 text-sm">
            <Link to="/mentions-legales" className="lien-sobre">
              Mentions légales
            </Link>
          </p>
        </div>
      </div>
      <div className="conteneur border-t border-border py-5 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {NOM_SITE}. Contenus proposés à des fins culturelles et
        patrimoniales.
      </div>
    </footer>
  );
}

function NotFoundComponent() {
  return (
    <div className="conteneur flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-6xl text-primary">404</p>
      <h1 className="mt-4 text-2xl">Cette page n'existe pas</h1>
      <p className="mt-2 text-muted-foreground">
        Le lien est peut-être ancien, ou la page a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
      >
        Revenir à l'accueil
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="conteneur flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl">Cette page n'a pas pu s'afficher</h1>
      <p className="mt-2 text-muted-foreground">Vous pouvez réessayer ou revenir à l'accueil.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="rounded-full bg-primary px-6 py-3 text-primary-foreground"
        >
          Réessayer
        </button>
        <a href="/" className="rounded-full border border-input px-6 py-3">
          Accueil
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${NOM_SITE} — ${SOUS_TITRE}` },
      {
        name: "description",
        content:
          "Découvrez la littérature arpitane (francoprovençale) : auteurs, œuvres, extraits et bibliothèque de recherche.",
      },
      { name: "author", content: NOM_SITE },
      { property: "og:site_name", content: NOM_SITE },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..600;1,400&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#contenu"
        className="sans-impression sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Aller au contenu principal
      </a>
      <div className="flex min-h-screen flex-col">
        <EnTete />
        <main id="contenu" className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <PiedDePage />
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
