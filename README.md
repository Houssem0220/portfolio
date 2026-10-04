# Houssem Guermazi — Portfolio

Site complet en HTML, CSS et JavaScript, prêt à déployer sur Vercel. Le ZIP contient le code source, le site généré et sa configuration. Il ne nécessite aucune clé API, base de données ou dépendance JavaScript externe.

## Déployer sur Vercel

### Avec GitHub et l’interface Vercel

1. Décompresser l’archive.
2. Créer un dépôt GitHub et y ajouter le **contenu du dossier `portfolio-houssem`**, avec `package.json` et `vercel.json` à la racine du dépôt.
3. Dans Vercel, sélectionner **Add New → Project**, puis importer ce dépôt.
4. Les paramètres sont déjà définis par `vercel.json` :

| Paramètre | Valeur |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Le dossier contenant `package.json` |
| Build Command | `npm run build` |
| Output Directory | `public` |
| Variables d’environnement | Aucune |

5. Cliquer sur **Deploy**.

### Depuis le dossier décompressé, sans dépôt GitHub

Avec Node.js et npm installés, ouvrir un terminal dans `portfolio-houssem` :

```bash
npm run build
npx vercel --prod
```

Se connecter à son compte Vercel lorsque la commande le demande et suivre les étapes. La commande renvoie l’adresse du site déployé. Il faut décompresser le ZIP avant d’utiliser cette méthode.

Documentation officielle :
- https://vercel.com/docs/cli/deploy
- https://vercel.com/docs/project-configuration

## Ouvrir le site sur son ordinateur

```bash
npm run build
npm run dev
```

Ouvrir ensuite `http://localhost:4173`. Aucun `npm install` n’est nécessaire : le serveur et la génération utilisent uniquement les modules intégrés à Node.js. Utiliser Node.js 18 ou une version plus récente.

Le site utilise des modules JavaScript : l’ouvrir avec le serveur local, plutôt qu’en double-cliquant sur `index.html`, permet à toutes les interactions de fonctionner.

Autre possibilité pour servir le site déjà généré :

```bash
python -m http.server 4173 --directory public
```

## Contenu et interactions

- Présentation de Houssem Guermazi, CentraleSupélec et master MVA à l’ENS Paris-Saclay.
- Parcours parallèle CentraleSupélec / MVA, IPEST et semestre à NUS Singapore.
- Expériences BNP Paribas Innovation Lab et SFR, avec détails ouvrables.
- Huit projets : Delaunay GPU, IA de confiance, prévision multimodale, recherche visuelle, DQN, segmentation/suivi, recommandation de films et classification de tweets.
- Filtres par domaine et fiches projet complètes dans une fenêtre accessible au clavier.
- Liens vers les dépôts publics vérifiés `footnote-docx` et `python-docx-cleaner`, ainsi que vers le profil GitHub complet.
- Versions française et anglaise ; préférence de langue mémorisée dans le navigateur.
- Maillage 3D animé : rotation, affichage des points, interaction à la souris et au clavier.
- Vue illustrative de tétraèdres avec modes faces / arêtes / sommets.
- Photo de profil et CV PDF téléchargeable depuis la présentation et la section Contact, en FR/EN.
- Portrait agrandi, avec lien vers LinkedIn ; logos de CentraleSupélec, MVA, NUS, BNP Paribas et SFR dans les sections correspondantes.
- Visuels des cartes de projets de même hauteur, avec affiliations et logos associés.
- Contact par email, copie de l’adresse et lien LinkedIn.
- Mise en page responsive, navigation mobile, prise en compte de la réduction des animations et styles d’impression.

La version française est aussi générée en HTML : le contenu principal est consultable et indexable même sans JavaScript. Le site ne charge aucun service tiers, police distante ou outil de suivi. Les liens GitHub ouvrent les dépôts ; la liste n’est pas synchronisée automatiquement.

## Modifier le site

| Fichier | Rôle |
| --- | --- |
| `public/content.js` | Textes FR/EN, liens, expériences et détails des projets |
| `public/assets/logos/` | Logos fournis, associés aux organisations dans `public/content.js` |
| `public/render.js` | Structure HTML des sections et des fiches projet |
| `public/styles.css` | Couleurs, typographie, mise en page, mobile et impression |
| `public/app.js` | Filtres, langue, menu mobile, fiches projet et contact |
| `public/mesh.js` | Animation géométrique 3D, sans bibliothèque externe |
| `scripts/build.mjs` | Génère `public/index.html` et `public/404.html` |
| `scripts/serve.mjs` | Serveur de développement local |
| `vercel.json` | Paramètres de déploiement Vercel |

Après une modification du contenu ou de la structure, exécuter `npm run build` pour régénérer les pages. Un nouveau déploiement Vercel exécute cette commande automatiquement. Ne pas modifier directement `public/index.html` : ce fichier est généré.

Pour partager directement la version anglaise, ajouter `?lang=en` à l’adresse du site. Pour la version française : `?lang=fr`.

Les coordonnées et les textes à actualiser sont centralisés dans `public/content.js`. La disponibilité actuellement affichée est avril 2027.

## Sources et choix éditoriaux

Les logos MVA et NUS sont servis localement en PNG transparent :

- MVA : image `logo_mva_935x701.jpg` fournie par Houssem, avec suppression du fond via imagegen, conservée dans `public/assets/logos/mva-transparent.png`.
- NUS : [identité visuelle](https://www.nus.edu.sg/identity/guidelines/logo-colour-and-background), [version officielle transparente](https://www.nus.edu.sg/research/images/librariesprovider2/default-album/nus-logo-blue-1200.png?sfvrsn=fe1f6aa6_1), conservée dans `public/assets/logos/nus-transparent.png`.

Les informations de parcours, dates, expériences et projets proviennent du CV fourni, « cv stage fin d’étude.pdf ». Les deux descriptions de dépôts proviennent de leurs README publics :

- https://github.com/Houssem0220/footnote-docx
- https://github.com/Houssem0220/python-docx-cleaner

Les projets du CV ne sont pas associés à un dépôt supposé : seuls les liens vérifiés sont affichés. Les chiffres de speedup et les conclusions expérimentales du projet Delaunay ne sont pas repris dans les textes du site. Le CV original est disponible dans `public/assets/cv-houssem-guermazi.pdf`, avec des liens de téléchargement dans la présentation et la section Contact. La photo fournie est conservée dans `public/assets/houssem-guermazi.png`. Les géométries animées sont des illustrations, pas des sorties de benchmark.

## Vérification

La génération, la syntaxe des modules, les traductions des huit projets, la cohérence des identifiants et les cibles des liens internes ont été contrôlées. Le serveur sert uniquement le dossier public, qui est aussi la cible de déploiement Vercel.

Le navigateur de prévisualisation et le téléchargement du navigateur local étaient bloqués dans l’environnement de création. La vérification visuelle en navigateur et les interactions sur appareils réels restent donc à effectuer après ouverture locale ou déploiement. Le site n’a pas été déployé sur un compte Vercel pendant sa création.
