<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS

## Architecture rules

- Les lectures publiques passent par des server functions dans `src/lib/catalogue.functions.ts` (client publishable), pour que le rendu serveur et le SEO disposent des données.
- L'espace de gestion (`/admin`) lit et écrit via le client navigateur Supabase sous le layout `_authenticated`, car il exige une session.
- Les constantes métier (régions, genres, siècles, e-mail de contact) vivent dans `src/lib/arpitan.ts` pour rester modifiables en un seul endroit.
