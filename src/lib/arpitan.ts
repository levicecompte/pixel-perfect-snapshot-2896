export const NOM_SITE = "Littérature Arpitane";
export const SOUS_TITRE = "Patrimoine Francoprovençal";

/** À remplacer par votre véritable adresse de contact. */
export const EMAIL_CONTACT = "contact@litterature-arpitane.fr";

export const REGIONS = [
  "Savoie",
  "Val d'Aoste",
  "Dauphiné",
  "Lyonnais",
  "Forez",
  "Bresse",
  "Franche-Comté",
  "Suisse Romande",
] as const;

export const GENRES = [
  "Poésie",
  "Conte",
  "Chanson",
  "Théâtre",
  "Prose",
  "Fable",
  "Texte religieux",
  "Chronique",
] as const;

export const SIECLES = [
  "XIIIe",
  "XIVe",
  "XVe",
  "XVIe",
  "XVIIe",
  "XVIIIe",
  "XIXe",
  "XXe",
  "XXIe",
] as const;

export const STATUTS = ["majeur", "à découvrir"] as const;

export function slugifier(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nomComplet(a: { prenom: string | null; nom: string }): string {
  return [a.prenom, a.nom].filter(Boolean).join(" ");
}

export function dates(a: { annee_naissance: number | null; annee_deces: number | null }): string {
  if (!a.annee_naissance && !a.annee_deces) return "";
  return `${a.annee_naissance ?? "?"} – ${a.annee_deces ?? "?"}`;
}
