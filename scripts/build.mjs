import { writeFile, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { renderSite } from '../public/render.js';
import { copy, profile, projects } from '../public/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = resolve(root, 'public');
for (const filename of ['styles.css', 'app.js', 'mesh.js', 'assets/favicon.svg']) await access(resolve(publicDir,filename));
if (new Set(projects.map(p=>p.id)).size !== projects.length) throw new Error('Les identifiants des projets doivent être uniques.');
for (const p of projects) for (const lang of ['fr','en']) for (const key of ['title','summary','problem','approach','takeaway','date']) {
  if (!p[key]?.[lang]?.length) throw new Error(`Contenu manquant : ${p.id}.${key}.${lang}`);
}
const jsonLd = JSON.stringify({
  '@context':'https://schema.org', '@type':'Person', name:profile.name,
  description:copy.fr.description, email:profile.email,
  sameAs:[profile.github,profile.linkedin],
  knowsLanguage:['French','English','Arabic','German'],
  affiliation:[{'@type':'EducationalOrganization',name:'CentraleSupélec'},{'@type':'EducationalOrganization',name:'ENS Paris-Saclay'}],
}).replace(/</g,'\\u003c');
const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <title>${copy.fr.title}</title>
  <meta name="description" content="${copy.fr.description}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${copy.fr.title}">
  <meta property="og:description" content="${copy.fr.description}">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="./assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="./styles.css">
  <script type="application/ld+json">${jsonLd}</script>
  <script type="module" src="./app.js"></script>
</head>
<body><div id="app">${renderSite('fr')}</div><noscript><p class="noscript-notice">${copy.fr.noScript}</p></noscript></body>
</html>`;
await writeFile(resolve(publicDir,'index.html'),html);
await writeFile(resolve(publicDir,'404.html'),`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page introuvable — Houssem Guermazi</title><link rel="stylesheet" href="/styles.css"><link rel="icon" href="/assets/favicon.svg"></head><body><main class="not-found container"><a class="wordmark" href="/">houssem<span>.</span></a><h1>Cette page<br>reste à explorer.</h1><p>L’adresse demandée ne correspond à aucune page du portfolio.</p><a class="button button-primary" href="/">Revenir au portfolio</a></main></body></html>`);
console.log(`Site généré : ${projects.length} projets, 2 expériences, versions FR/EN. Dossier : public/`);
