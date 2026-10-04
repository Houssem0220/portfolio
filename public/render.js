import { profile, copy, projects, repositories, experiences, logos } from './content.js';
import { visualLabels } from './project-scenes.js';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = escapeHtml;
const lines = (values) => values.map(e).join('<br>');
const tags = (values) => `<ul class="tags" aria-label="Technologies">${values.map(v => `<li>${e(v)}</li>`).join('')}</ul>`;
const list = (values) => `<ul class="bullet-list">${values.map(v => `<li>${e(v)}</li>`).join('')}</ul>`;

function organizationLogo(key) {
  const logo = logos[key];
  return logo ? `<img class="organization-logo logo-${key}" src="${e(logo.src)}" alt="" width="${logo.width}" height="${logo.height}" loading="lazy" decoding="async">` : '';
}

function projectAffiliation(project, lang) {
  const logo = project.organization.startsWith(logos.centralesupelec.name) ? organizationLogo('centralesupelec') : '';
  return `<div class="project-affiliation">${logo}<p class="project-context">${e(project.organization)} · ${e(project.date[lang])}</p></div>`;
}

export function projectDetails(project, lang) {
  const t = copy[lang];
  return `${projectAffiliation(project, lang)}
    <h2 id="dialog-title">${e(project.title[lang])}</h2>
    ${tags(project.tags)}
    <div class="detail-section"><h3>${t.problem}</h3><p>${e(project.problem[lang])}</p></div>
    <div class="detail-section"><h3>${t.approach}</h3>${list(project.approach[lang])}</div>
    <div class="detail-section detail-takeaway"><h3>${t.takeaway}</h3><p>${e(project.takeaway[lang])}</p></div>
    <a class="button button-primary" href="mailto:${profile.email}?subject=${encodeURIComponent(`Projet : ${project.title[lang]}`)}">${t.discuss}</a>`;
}

function projectAnimation(project, lang) {
  const architecture = project.id === 'forecasting';
  const cispa = project.id === 'trustworthy-ai';
  return `<div class="project-animation ${architecture ? 'architecture-animation' : ''} ${cispa ? 'cispa-animation' : ''} js-only">
    ${cispa ? `<div class="scene-modes" role="group" aria-label="${lang === 'fr' ? 'Méthode illustrée' : 'Illustrated method'}">${[['attack',lang === 'fr' ? 'Transfert d’attaques' : 'Attack transfer'],['attribution','Attribution'],['watermark',lang === 'fr' ? 'Filigranes' : 'Watermarks']].map(([mode,label])=>`<button type="button" data-scene-mode="${mode}" aria-controls="scene-${project.id}" aria-pressed="${mode === 'attack'}">${label}</button>`).join('')}</div>` : ''}<canvas id="scene-${project.id}" data-project-scene="${project.id}" data-lang="${lang}" width="${architecture ? 400 : 440}" height="${architecture ? 610 : cispa ? 250 : 184}" role="img" aria-label="${e(visualLabels[project.id][lang])}">${e(visualLabels[project.id][lang])}</canvas>
    <div class="project-animation-footer"><span>${architecture ? (lang === 'fr' ? 'Architecture · fig. 3–5 du rapport' : 'Architecture · report fig. 3–5') : (lang === 'fr' ? 'Illustration du concept' : 'Concept illustration')}</span><button type="button" class="animation-toggle" data-animation-toggle aria-controls="scene-${project.id}" aria-pressed="false" aria-label="${e(`${lang === 'fr' ? 'Animer' : 'Animate'} : ${project.title[lang]}`)}"><span class="animation-icon" aria-hidden="true"></span>Animation</button></div>
  </div>`;
}

function delaunayVisual(lang) {
  const t = copy[lang];
  return `<div class="feature-visual delaunay-visual">
    <div class="feature-canvas-wrap"><canvas id="feature-mesh" role="img" tabindex="0" width="360" height="360" aria-label="${t.canvasLabel}">${t.canvasLabel}</canvas><span class="canvas-caption">${t.illustrative}</span></div>
    <div class="feature-controls js-only"><fieldset><legend>${t.display}</legend>${[['faces', t.tetra], ['edges', t.edges], ['points', t.vertices]].map(([key,label]) => `<label><input type="radio" name="mesh-display" value="${key}" ${key === 'faces' ? 'checked' : ''}>${label}</label>`).join('')}</fieldset><label class="rotation-check"><input type="checkbox" data-rotation="feature" checked>${t.auto}</label></div>
  </div>`;
}

function projectCard(project, lang, index) {
  const t = copy[lang];
  return `<article class="project-card reveal" data-project-card data-category="${project.category}" data-extra="${index > 3}" id="project-${project.id}">
    <div class="project-visual">${project.id === 'delaunay' ? delaunayVisual(lang) : projectAnimation(project,lang)}</div>
    ${projectAffiliation(project, lang)}
    <h3>${e(project.title[lang])}</h3>
    <p>${e(project.summary[lang])}</p>
    <button class="text-button js-only" type="button" data-project="${project.id}">${t.view}<span class="plus" aria-hidden="true">+</span></button>
    <details class="fallback-details"><summary>${t.more}</summary><p>${e(project.problem[lang])}</p>${list(project.approach[lang])}<p>${e(project.takeaway[lang])}</p></details>
  </article>`;
}

export function renderSite(lang = 'fr') {
  const t = copy[lang];
  const featured = projects.find(project => project.featured);
  return `<a class="skip-link" href="#main">${t.skip}</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="wordmark" href="#top" aria-label="Houssem Guermazi">houssem<span>.</span></a>
      <nav id="main-nav" aria-label="${lang === 'fr' ? 'Navigation principale' : 'Main navigation'}">
        <a href="#projects">${t.projects}</a><a href="#experience">${t.experience}</a><a href="#education">${t.education}</a>
      </nav>
      <div class="header-actions">
        <div class="language-switch js-only" aria-label="${lang === 'fr' ? 'Langue' : 'Language'}">
          <button type="button" data-language="fr" lang="fr" aria-label="Français" aria-pressed="${lang === 'fr'}">FR</button><span aria-hidden="true">/</span><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="${lang === 'en'}">EN</button>
        </div>
        <a class="button button-dark header-contact" href="#contact">${t.contact}</a>
        <button class="menu-toggle js-only" type="button" aria-expanded="false" aria-controls="main-nav">${t.menu}<span aria-hidden="true" class="menu-lines"></span></button>
      </div>
    </div>
  </header>
  <main id="main">
    <section class="hero container" id="top" aria-labelledby="hero-name">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 id="hero-name">Houssem<br>Guermazi<span>.</span></h1>
          <p class="hero-tagline">${lines(t.tagline)}</p>
          <p class="hero-intro">${e(t.intro)}</p>
          <div class="hero-actions"><a class="button button-primary" href="#projects">${t.explore}</a><a class="button button-outline" href="${e(profile.cv)}" download="CV-Houssem-Guermazi.pdf">${t.downloadCv}</a><a class="button button-outline" href="#contact">${t.contactMe}</a></div>
          <p class="availability">${t.availability}</p>
        </div>
        <div class="hero-visual">
          <div class="hero-artwork">
            <canvas id="hero-mesh" role="img" tabindex="0" aria-label="${t.canvasLabel}" width="620" height="620">${t.canvasLabel}</canvas>
            <a class="hero-portrait-link" href="${e(profile.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="${e(profile.name)} — LinkedIn">
              <img class="hero-portrait" src="${e(profile.photo)}" alt="${e(profile.name)}" width="1744" height="1744" fetchpriority="high">
              <span class="portrait-link-label">LinkedIn <span aria-hidden="true">↗</span></span>
            </a>
          </div>
          <div class="mesh-controls js-only"><button class="mini-button" type="button" data-rotation="hero" aria-pressed="true">${t.rotation}</button><button class="mini-button" type="button" data-point-mode aria-pressed="false">${t.points}</button></div>
        </div>
      </div>
      <div class="academic-rail">
        <a href="#education">${organizationLogo('centralesupelec')}<strong>CentraleSupélec</strong><span>${t.school1}</span></a>
        <a href="#education"><strong>MVA / ENS Paris-Saclay</strong><span>${t.school2}</span></a>
        <a href="#singapore"><strong>NUS · Singapore</strong><span>${t.school3}</span></a>
      </div>
    </section>

    <section class="section projects-section" id="projects" aria-labelledby="projects-heading">
      <div class="container">
        <div class="section-heading reveal"><div><p class="section-index">${t.projectIndex}</p><h2 id="projects-heading">${lines(t.projectTitle)}</h2></div><p class="section-lead">${t.projectIntro}</p></div>
        <div class="project-toolbar js-only"><div class="filters" role="group" aria-label="${lang === 'fr' ? 'Filtrer les projets' : 'Filter projects'}">${t.filters.map(([key, label]) => `<button type="button" data-filter="${key}" aria-pressed="${key === 'all'}">${label}</button>`).join('')}</div><span id="project-count" class="sr-only" role="status" aria-live="polite"></span></div>
        <article class="featured-project forecasting-feature reveal" data-project-card data-category="${featured.category}" id="project-${featured.id}">
          ${projectAnimation(featured,lang)}
          <div class="feature-copy"><p class="featured-label">${lang === 'fr' ? 'PROJET SÉLECTIONNÉ' : 'SELECTED PROJECT'}</p><p class="project-context">${featured.organization} · ${featured.date[lang]}</p><h3>${featured.title[lang]}</h3><p>${featured.summary[lang]}</p><p class="architecture-explainer">${lang === 'fr' ? 'Architecture encodeur-décodeur : fusion des métadonnées et de l’historique, initialisation du décodeur, cross-attention et prévision des revenus quotidiens.' : 'Encoder–decoder architecture: metadata and history fusion, decoder initialization, cross-attention, and daily revenue prediction.'}</p>${tags(featured.tags)}<button class="button button-primary js-only" type="button" data-project="${featured.id}">${t.view}</button><details class="fallback-details"><summary>${t.more}</summary>${list(featured.approach[lang])}<p>${e(featured.takeaway[lang])}</p></details></div>
        </article>
        <div class="project-grid">${projects.filter(p => p !== featured).map((p,i) => projectCard(p,lang,i)).join('')}</div>
        <div class="more-projects js-only"><p>${t.also}</p><button type="button" class="button button-outline" id="show-all-projects" aria-expanded="false">${t.showAll}</button></div>
        <aside class="open-source reveal" data-open-source aria-labelledby="open-heading">
          <div><h3 id="open-heading">Open source</h3><p>${t.openIntro}</p><a class="text-link" href="${profile.github}?tab=repositories" target="_blank" rel="noopener noreferrer">${t.githubAll}</a></div>
          <div class="repo-list"><a class="github-profile" href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub / Houssem0220</a>${repositories.map(r=>`<a class="repo-row" href="${r.url}" target="_blank" rel="noopener noreferrer"><strong>${r.name}</strong><span>${r.description[lang]}</span><span class="repo-action">${t.githubView}</span></a>`).join('')}</div>
        </aside>
      </div>
    </section>

    <section class="section container" id="experience" aria-labelledby="experience-heading">
      <div class="experience-layout"><div class="experience-heading reveal"><p class="section-index">${t.experienceIndex}</p><h2 id="experience-heading">${lines(t.experienceTitle)}</h2><p class="section-lead">${t.experienceIntro}</p></div><div class="experience-list">${experiences.map(x=>`<article class="experience-item reveal"><div class="experience-brand">${organizationLogo(x.logo)}<div class="experience-title"><h3>${x.company}</h3><span class="date">${x.date[lang]}</span></div></div><p class="role">${x.role}</p><p>${x.intro[lang]}</p>${list(x.bullets[lang])}<details><summary>${t.more}<span class="plus" aria-hidden="true">+</span></summary>${list(x.details[lang])}</details></article>`).join('')}</div></div>
      <div class="skills reveal"><h2>${lines(t.skillsTitle)}</h2><div class="skill-grid">${t.skills.map(([title,body])=>`<div><h3>${title}</h3><p>${body}</p></div>`).join('')}</div></div>
    </section>

    <section class="section education-section" id="education" aria-labelledby="education-heading"><div class="container"><div class="reveal"><p class="section-index">${t.educationIndex}</p><h2 id="education-heading">${lines(t.educationTitle)}</h2></div><div class="education-grid">
      <article class="education-item reveal">${organizationLogo('centralesupelec')}<h3>CentraleSupélec</h3><p class="education-degree">${t.csDegree}</p><p>${t.csText}</p><div class="gpa">${t.grades.map(e).join('<br>')}</div></article>
      <article class="education-item reveal"><h3>MVA</h3><p class="education-degree">ENS Paris-Saclay · 2026–2027</p><p>${t.mvaText}</p></article>
    </div><p class="prep-line reveal">${t.prep}</p></div></section>

    <section class="singapore" id="singapore" aria-labelledby="singapore-heading"><div class="container singapore-grid">
      <div class="singapore-left reveal"><p class="singapore-word">Singapore<span>.</span></p><p class="nus-name">National University of Singapore</p><p>${t.singaporeDate}</p><div class="singapore-coordinate" aria-hidden="true"><span>PARIS</span><span class="route-line"><i></i></span><span>SINGAPORE</span></div></div>
      <div class="singapore-copy reveal"><h2 id="singapore-heading">${lines(t.singaporeTitle)}</h2><p>${t.singaporeText}</p><p class="gpa">${t.singaporeGpa}</p><p class="course-list">Advanced Deep Learning · Reinforcement Learning · Fundamentals of Machine Learning</p><div class="nus-projects"><h3>${t.academicProjects}</h3><a href="#project-forecasting" class="text-link" data-project="forecasting">${t.forecast}</a><a href="#project-reinforcement-learning" class="text-link" data-project="reinforcement-learning">${t.control}</a></div></div>
    </div></section>
  </main>

  <footer id="contact" class="contact-section"><div class="container"><div class="contact-grid"><div class="reveal"><h2>${lines(t.contactTitle)}</h2><p>${t.contactIntro}</p></div><div class="contact-actions reveal"><p class="footer-label">${t.contactMe}</p><a class="email-link" href="mailto:${profile.email}">${profile.email}</a><a class="button button-light-outline" href="${e(profile.cv)}" download="CV-Houssem-Guermazi.pdf">${t.downloadCv}</a><button type="button" id="copy-email" class="button button-light-outline js-only">${t.copyEmail}</button><p id="copy-status" role="status" aria-live="polite"></p><p class="footer-label">${t.work}</p><div class="social-links"><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div></div><div class="footer-bottom"><a href="#top">Houssem Guermazi</a><p>${t.languages}</p></div></div></footer>
  <dialog id="project-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><span>${t.projects}</span><button type="button" class="dialog-close" aria-label="${t.close}">${t.close} <span aria-hidden="true">×</span></button></div><div id="dialog-content"></div></dialog>`;
}
