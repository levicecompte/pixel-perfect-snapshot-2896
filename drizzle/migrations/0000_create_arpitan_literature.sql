CREATE TABLE public.auteurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  nom TEXT NOT NULL,
  prenom TEXT,
  annee_naissance INTEGER,
  annee_deces INTEGER,
  siecle TEXT,
  region TEXT,
  biographie TEXT,
  photo_url TEXT,
  statut TEXT NOT NULL DEFAULT 'à découvrir',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.oeuvres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titre TEXT NOT NULL,
  auteur_id UUID REFERENCES public.auteurs(id) ON DELETE SET NULL,
  annee INTEGER,
  siecle TEXT,
  region TEXT,
  genre TEXT,
  resume TEXT,
  extrait TEXT,
  texte_integral TEXT,
  langue TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_oeuvres_auteur ON public.oeuvres(auteur_id);

GRANT SELECT ON public.auteurs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auteurs TO authenticated;
GRANT ALL ON public.auteurs TO service_role;

GRANT SELECT ON public.oeuvres TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oeuvres TO authenticated;
GRANT ALL ON public.oeuvres TO service_role;

ALTER TABLE public.auteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oeuvres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des auteurs" ON public.auteurs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion des auteurs par membres connectes" ON public.auteurs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Lecture publique des oeuvres" ON public.oeuvres FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion des oeuvres par membres connectes" ON public.oeuvres FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.auteurs (slug, nom, prenom, annee_naissance, annee_deces, siecle, region, biographie, statut) VALUES
('amelie-gex', 'Gex', 'Amélie', 1835, 1883, 'XIXe', 'Savoie', 'Poétesse savoyarde née à La Chapelle-Blanche, Amélie Gex est l''une des grandes voix de la littérature arpitane. Elle écrit en savoyard et en français une œuvre poétique nourrie de la vie paysanne, du deuil et d''un profond attachement à sa terre. Ses recueils, publiés dans la seconde moitié du XIXe siècle, restent une référence pour qui veut entendre la langue vivante des campagnes de Savoie.', 'majeur'),
('jean-baptiste-cerlogne', 'Cerlogne', 'Jean-Baptiste', 1826, 1910, 'XIXe', 'Val d''Aoste', 'Prêtre et poète valdôtain, Jean-Baptiste Cerlogne est considéré comme le père de la littérature patoise du Val d''Aoste. Ancien berger devenu abbé, il consacre sa vie à écrire, enseigner et défendre le francoprovençal, publiant poèmes, contes et un dictionnaire du patois valdôtain.', 'majeur'),
('marguerite-doingt', 'd''Oingt', 'Marguerite', 1240, 1310, 'XIIIe', 'Lyonnais', 'Prieure chartreuse du Lyonnais, Marguerite d''Oingt est la première autrice connue à écrire en francoprovençal. Ses écrits mystiques, rédigés en latin et en langue vulgaire, constituent le plus ancien témoignage littéraire majeur de l''arpitan.', 'majeur'),
('claudine-favre', 'Favre', 'Claudine', 1902, 1978, 'XXe', 'Bresse', 'Conteuse bressane (figure de démonstration), Claudine Favre a recueilli et réécrit les contes veillés des fermes de la Bresse, transmettant en arpitan un répertoire oral longtemps resté inédit.', 'à découvrir');

INSERT INTO public.oeuvres (slug, titre, auteur_id, annee, siecle, region, genre, resume, extrait, langue) VALUES
('reclans-de-savoye', 'Reclans de Savoye', (SELECT id FROM public.auteurs WHERE slug = 'amelie-gex'), 1879, 'XIXe', 'Savoie', 'Poésie', 'Recueil de poèmes en savoyard où Amélie Gex chante les travaux, les fêtes et les peines du monde rural de son enfance.', 'Lo vent de la montagne passe sur les blâs mûrs, et porte jusqu''à nous la voix des vieux qui n''ont jamais quitté la terre.', 'Graphie locale (savoyard)'),
('lo-tsalende', 'Lo Tsalende', (SELECT id FROM public.auteurs WHERE slug = 'jean-baptiste-cerlogne'), 1880, 'XIXe', 'Val d''Aoste', 'Chanson', 'Chant de Noël valdôtain, l''une des pièces les plus aimées de Cerlogne, encore reprise aujourd''hui dans les veillées.', 'Tsalende, Tsalende, la nët de la lumiére, quan le bèrdzé dèvalon di montagne...', 'Graphie locale (valdôtain)'),
('speculum', 'Speculum — Le Miroir', (SELECT id FROM public.auteurs WHERE slug = 'marguerite-doingt'), 1294, 'XIIIe', 'Lyonnais', 'Texte religieux', 'Récit mystique où Marguerite d''Oingt relate ses visions, dans une prose d''une grande limpidité, témoin fondateur de l''écrit arpitan.', 'Ele vit un livro, loqua était escrit de letres d''or, et en cel livro était escrita tota la vita de Crist.', 'Francoprovençal médiéval'),
('les-veillees-de-bresse', 'Les Veillées de Bresse', (SELECT id FROM public.auteurs WHERE slug = 'claudine-favre'), 1951, 'XXe', 'Bresse', 'Conte', 'Vingt contes recueillis auprès des anciens de la Bresse, où les loups parlent, les fées lavent le linge et les veillées ne finissent jamais avant l''aube.', 'On disêt qu''a la nuet, la lavandiére du pont rinçâve son linge blanc, et que celui qui l''aidâve ne rentrâve jamés chiéz lui.', 'ORB (orthographe de référence)');