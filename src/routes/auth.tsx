import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NOM_SITE } from "@/lib/arpitan";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Espace d'administration — ${NOM_SITE}` },
      { name: "description", content: "Connexion à l'espace d'administration du site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Espace d'administration — ${NOM_SITE}` },
      { property: "og:description", content: "Connexion réservée à la gestion du site." },
    ],
  }),
  component: PageAuth,
});

function PageAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"connexion" | "creation">("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    try {
      if (mode === "creation") {
        const { error } = await supabase.auth.signUp({
          email,
          password: motDePasse,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Compte créé. Vous êtes connecté.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
        if (error) throw error;
        toast.success("Bienvenue !");
      }
      navigate({ to: "/admin" });
    } catch (erreur) {
      const message = erreur instanceof Error ? erreur.message : "Une erreur est survenue.";
      toast.error(
        message.includes("Invalid login credentials")
          ? "Adresse e-mail ou mot de passe incorrect."
          : message,
      );
    } finally {
      setEnCours(false);
    }
  }

  const champ =
    "mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg";

  return (
    <div className="conteneur max-w-xl py-16">
      <h1 className="titre-page">Administration</h1>
      <p className="mt-4 text-muted-foreground">
        {mode === "connexion"
          ? "Entrez votre adresse e-mail et votre mot de passe pour gérer les auteurs et les œuvres."
          : "Créez votre compte d'administration. Une seule fois : ensuite, vous vous connecterez avec ces identifiants."}
      </p>

      <form onSubmit={envoyer} className="carte-douce mt-8 p-7">
        <label htmlFor="email" className="block text-lg font-medium">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={champ}
        />

        <label htmlFor="mdp" className="mt-6 block text-lg font-medium">
          Mot de passe
        </label>
        <input
          id="mdp"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "creation" ? "new-password" : "current-password"}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className={champ}
        />
        <p className="mt-2 text-sm text-muted-foreground">6 caractères minimum.</p>

        <button
          type="submit"
          disabled={enCours}
          className="mt-8 w-full rounded-xl bg-primary px-6 py-4 text-lg text-primary-foreground disabled:opacity-60"
        >
          {enCours
            ? "Patientez…"
            : mode === "connexion"
              ? "Se connecter"
              : "Créer mon compte"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "connexion" ? "creation" : "connexion")}
        className="lien-sobre mt-6 text-[0.95rem]"
      >
        {mode === "connexion"
          ? "Première visite ? Créer mon compte d'administration"
          : "J'ai déjà un compte : me connecter"}
      </button>
    </div>
  );
}
