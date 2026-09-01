# CLAUDE.md — Eagle Ray Expeditions · Site web

Contexte permanent du projet. Lis ce fichier avant toute tâche.

## Projet

Site d'Eagle Ray Expeditions (ERE) — expéditions en voilier en petit groupe dans la
Mer de Cortez, au départ de La Paz, Baja California Sur, Mexique. Lancement
commercial : 1er octobre 2026.

Page active en cours : `/friends-family` — landing de conversion pour leads chauds
(ils connaissent déjà ERE et connaissent Thibault personnellement). Objectif unique :
faire remplir un formulaire conversationnel de 7 questions.

## Stack

- Next.js, déploiement Vercel, repo GitHub
- Mobile-first — la majorité des visiteurs ouvrent le lien depuis WhatsApp sur mobile
- Formulaire : embed Tally avec habillage custom (Tally est déjà dans le stack ERE et
  gère la logique conditionnelle). Si un formulaire custom est construit : ne jamais
  utiliser de `<form>` HTML natif — state + submit par événement.
- Pas de localStorage / sessionStorage

## Langue

- Site et copy : espagnol, registre mexicain neutre (pas castillan)
- Échanges avec Thibault : français
- Documents partenaires / externes : anglais

## Règles de marque — non négociables

Vocabulaire interdit, dans toutes les langues : `transformación` · `premium` ·
`reconexión` · `plenitud` et leurs équivalents anglais : `transformative` ·
`reconnect` · `meaningful connection` · `restored`

Ton : déclaratif, phrases courtes, zéro inflation adjectivale. L'expérience porte le
poids, pas les adjectifs. Le concept de transformation n'est pas interdit — mais
c'est au client de le formuler, jamais à ERE de le promettre.

Ne jamais affirmer un nombre de bateaux qu'ERE « possède ». Formulation validée :
« red mapeada de más de 50 embarcaciones en La Paz ». Jamais « flota de ERE », jamais
« tenemos 30 barcos ». Un seul accord direct signé existe : Icon Charter.

Ne jamais affirmer un effectif d'équipe chiffré. Utiliser le langage de rôle :
« capitanes, chefs y expedition leaders formados bajo el sistema ERE ». Jamais un
nombre.

Ne jamais inventer de politique d'annulation, d'acompte, de remboursement, ni de
compteur de rareté (« quedan X lugares »). Si la donnée n'existe pas, la section est
omise et un `TODO` est signalé à Thibault. Une page qui ment se paie en crédibilité
auprès de leads qui connaissent le terrain.

## Décisions déjà prises — ne pas rouvrir

- Early Bird : réservations confirmées avant le 30 septembre 2026, voyages en Q4 2026
  (oct–déc). Après : tarifs standard, sous réserve de disponibilité.
- Le formulaire fait exactement 7 questions, une par écran, format conversationnel.
  Barre de progression visible. Cible : moins de 2 minutes.
- Q3 (choix du bateau) est multi-select — « me laten varias ».
- Section Early Bird : sans photo. C'est un bloc d'urgence, une image l'affaiblit.
- Le hero est la destination ; Thibault apparaît en bas de page, au closing — jamais
  en hero. En Friends & Family l'argument c'est lui, mais en signature, pas en
  vitrine.

## Assets

La source de vérité est Airtable, base « Eagle Ray », table `Marketing Assets`. Une
ligne par photo : nom d'archive, nom d'origine, catégorie, description, lien Drive,
droits, résolution, et `Web_Filename` qui pointe vers le fichier utilisé sur le site.

Répartition des rôles :

- Airtable = le catalogue. Ce qu'ERE possède et ce qu'ERE a le droit d'utiliser.
- Google Drive = le stockage des fichiers pleine résolution.
- `/public/assets` = sortie de production. Un dérivé, pas une archive : il se
  régénère depuis les originaux, on ne l'utilise pas pour ranger.

Une photo n'existe pour ERE que si elle a une ligne Airtable. Tant qu'elle est un
`WhatsApp_Image_...` posé dans un dossier, elle n'existe pas.

Règle de publication : une photo est publiable si `Rights` vaut `ERE Owned` ou
`Icon - Accord direct`, ou si `Cleared_By_Thibault` est coché (override manuel avec
justification dans `Rights_Note`). Si aucune des deux conditions n'est vraie
(`Rights = Kit chantier - non verifie` ou `A confirmer`, et `Cleared_By_Thibault` non
coché), ne pas publier — laisser le trou visible, ne pas générer de placeholder.

Emplacement : `/public/assets/{hero,secciones,barcos}/` Chaque image existe en
`.jpg` + `.webp`. Servir le WebP avec fallback JPEG.

Convention de nommage : `[section]-[ordre]-[contenu]`, minuscules, tirets. Exemples :
`icon-1-exterior`, `bd-2-cubierta`, `sueno-ustedes`.

Ne jamais accepter un fichier au nom brut (`WhatsApp_Image_2026-07-10_at_20_38_56.jpeg`,
`PHOTO-2026-03-17-18-01-58.jpeg`). Ces noms n'indiquent pas le contenu et ont déjà
provoqué une interversion de deux photos. Tout asset arrive renommé et vérifié.

Ne jamais générer, inventer ou substituer une image manquante. Si un asset est
absent, laisser le trou et le signaler. Un placeholder gris se lit comme une
négligence.

Ratios : hero 16:9 desktop + 4:5 mobile · sections 3:2 ou 2:3 · carrousels bateaux
3:2 strict. Le carrousel saute en hauteur à chaque swipe si un seul fichier dévie.

Les fonds d'image du formulaire sont désaturés en CSS (`filter`, `opacity`), pas en
livrant des fichiers dupliqués.

### Carrousels bateaux (Q3) — grammaire fixe

Les 4 cartes suivent le même ordre : `Exterior` → `Cubierta` → `Camarote`. C'est
structurel, pas décoratif : le visiteur compare les 4 options en swipant, et l'ordre
fixe transforme le carrousel en tableau comparatif. Ne pas réordonner.

Conflit d'interaction à respecter : l'image ne fait que naviguer, jamais sélectionner.
La sélection vit dans un contrôle explicite sous le nom du bateau. L'état sélectionné
reste visible pendant le swipe.

Exceptions actuelles :

- `bali-3` est un intérieur/cuisine, pas une cabine → libellé `Interior`
- `astrea` n'a que 2 slides — le composant doit accepter une longueur variable

## Méthode de travail

- Une tâche scopée par session. Jamais « construis toute la page ». Un scope large
  qui plante à moitié oblige à tout refaire.
- Commit après chaque étape qui fonctionne — checkpoint git avant de continuer.
- Vérifier avant d'affirmer. Ne pas déclarer un fichier présent, une image correcte
  ou une étape réussie sans l'avoir contrôlé. Une interversion de photos est déjà
  passée à travers faute de vérification visuelle.
- Signaler les blocages plutôt que de les contourner par une invention.

## TODO ouverts

- [ ] `astrea-3-camarote` — photo de cabine Astréa 42 manquante (à demander à
      Olivier / kit presse Fountaine Pajot). En attendant : carrousel à 2 slides.
- [ ] FAQ question 2 (politique d'acompte) — en attente des CGV ERE. Omettre si
      absente.
- [x] Droits Bali/Astréa — Thibault a tranché le 10/08/2026 : usage standard de
      matériel promo partenaire, publiable sans vérification formelle. Tracé dans
      Airtable via `Cleared_By_Thibault` + `Rights_Note` sur les 5 lignes concernées.
- [ ] Résolution — le hero est en `Original requis` : il plafonne à 1206 px de
      large, insuffisant pour du full-bleed desktop retina. Demander l'original à
      Olivier. Voir `assets/RESOLUTION.md` pour le détail par fichier.
- [ ] 13 photos du catalogue sont en `Resolution: Non verifie` — à mesurer lors du
      prochain passage.
- [ ] Hero `/friends-family` : les deux variantes (mobile + desktop) sont rendues en
      parallèle et masquées en CSS. Chrome télécharge quand même celle qui est en
      `display:none` — vérifié le 10/08/2026 (`naturalWidth` non nul sur la variante
      cachée). Le mobile paie donc les deux fichiers. Seul `<picture>` + `<source
      media>` n'en télécharge qu'un — mais on perd l'optimisation de `next/image`, à
      compenser en générant les `.webp` en amont.
- [ ] `.webp` manquants : `hero/`, `secciones/` et `barcos/` ne contiennent que des
      `.jpg`. La règle « chaque image existe en `.jpg` + `.webp` » n'est aujourd'hui
      satisfaite qu'indirectement, via la conversion à la volée de `next/image`.
- [ ] `cierre-thibault.jpg` est un plan général au timón : dans l'avatar rond du
      closing, le visage occupe ~15 % du cadre et on lit le bateau, pas la personne.
      Il faut un recadrage carré dédié depuis l'original.
- [ ] Vérifier le `alt` de `como-funciona-salon.jpg` : il annonce « catamarán ICON »
      alors que l'intérieur ressemble à un monocoque. À confirmer avec Airtable.
