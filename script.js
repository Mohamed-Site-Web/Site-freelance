// ── NAV ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('elevated', scrollY > 20);
});


// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobMenu.classList.toggle('open');
});
document.querySelectorAll('.m-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobMenu.classList.remove('open');
}));

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealIO  = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 50);
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealIO.observe(el));


// ── PORTFOLIO : UNIVERS DEV / CRÉA ──
document.querySelectorAll('.universe-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const u = btn.dataset.u;
    document.querySelectorAll('.universe-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
    document.querySelectorAll('[data-filters]').forEach(f => { f.hidden = f.dataset.filters !== u; });
    document.getElementById('portfolioBand').classList.toggle('is-crea', u === 'crea');
    document.body.classList.toggle('crea-mode', u === 'crea');
    document.querySelectorAll('[data-grid]').forEach(g => {
      g.hidden = g.dataset.grid !== u;
      if (!g.hidden) g.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
  });
});

// ── PORTFOLIO : SOUS-ONGLETS (propres à chaque univers) ──
document.querySelectorAll('[data-filters]').forEach(group => {
  const grid = document.querySelector(`[data-grid="${group.dataset.filters}"]`);
  group.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      grid.querySelectorAll('.portfolio-card').forEach(card => {
        const match = f === 'all' || card.dataset.cat === f;
        card.style.transition = 'opacity 0.35s, transform 0.35s';
        card.style.opacity    = match ? '1' : '0.2';
        card.style.transform  = match ? '' : 'scale(0.97)';
        card.style.pointerEvents = match ? 'all' : 'none';
      });
    });
  });
});

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ── FORMULAIRE ──
const contactForm = document.getElementById('contactForm');
const cfMessage = document.getElementById('cfMessage');
const cfCount = document.getElementById('cfCount');
cfMessage.addEventListener('input', () => { cfCount.textContent = cfMessage.value.length + ' / 1000'; });

contactForm.addEventListener('input', e => e.target.classList.remove('invalid'));

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  let firstBad = null;
  contactForm.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
    f.classList.toggle('invalid', bad);
    if (bad && !firstBad) firstBad = f;
  });
  if (firstBad) { firstBad.focus(); return; }
  const msg = document.getElementById('formMsg');
  msg.classList.add('show');
  contactForm.reset();
  cfCount.textContent = '0 / 1000';
  setTimeout(() => msg.classList.remove('show'), 5000);
});

// ── HERO PARALLAX ──
window.addEventListener('mousemove', e => {
  const circle = document.getElementById('photoCircle');
  if (!circle || window.innerWidth < 900) return;
  const cx = window.innerWidth * 0.75;
  const cy = window.innerHeight * 0.5;
  const dx = (e.clientX - cx) / cx * 6;
  const dy = (e.clientY - cy) / cy * 5;
  circle.style.transform = `translate(${dx}px,${dy}px)`;
});

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});




//-----------------------------------------------------------------------PARCOURS-----------------------------------------------------------------------
// ── PARCOURS HORIZONTAL ──
const parcoursSection = document.getElementById('parcours');
const parcoursLine = document.querySelector('.parcours-line');
const parcoursLineFill = document.querySelector('.parcours-line-fill');
const parcoursItems = document.querySelectorAll('.parcours-item');

if (parcoursSection && parcoursLine && parcoursLineFill && parcoursItems.length) {

  // place les points selon data-pos (%)
  parcoursItems.forEach(item => {
    const pos = parseFloat(item.dataset.pos || '0'); // ex: 10, 35, 65, 90
    item.style.left = pos + '%';
  });

  let parcoursAnimated = false;

  const obsParcours = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !parcoursAnimated) {
        parcoursAnimated = true;

        // anime la ligne (3s)
        parcoursLineFill.style.width = '100%';

        let progress = 0;
        const duration = 3000; // 3s
        const step = 30;       // ms
        const increment = 100 / (duration / step);

        const interval = setInterval(() => {
          progress += increment;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }

          parcoursItems.forEach(item => {
            const pos = parseFloat(item.dataset.pos || '0');
            if (progress >= pos) {
              item.classList.add('visible');
            }
          });
        }, step);
      }
    });
  }, { threshold: 0.3 });

  obsParcours.observe(parcoursSection);
}


// ==================== FOND ANIMÉ CANVAS ====================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.25;
        this.speedY = Math.random() * 1 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==================== LANGUES (FR / EN / ES) ====================
// Dictionnaire : texte français -> [anglais, espagnol]
const TRANSLATIONS = {
"À Propos": [
"About",
"Sobre mí"
],
"Tarifs": [
"Pricing",
"Tarifas"
],
"Télécharger mon CV": [
"Download my CV",
"Descargar mi CV"
],
"Me contacter": [
"Contact me",
"Contactar"
],
"Développeur Freelance Full Stack": [
"Freelance Full Stack Developer",
"Desarrollador Freelance Full Stack"
],
"Développeur Full Stack créatif": [
"Creative Full Stack Developer",
"Desarrollador Full Stack creativo"
],
"Je transforme des idées en applications web modernes et performantes, en utilisant les dernières technologies comme": [
"I turn ideas into modern, high-performing web applications, using the latest technologies such as",
"Transformo ideas en aplicaciones web modernas y eficaces, con las últimas tecnologías como"
],
"et": [
"and",
"y"
],
"2 ans d'expérience": [
"2 years of experience",
"2 años de experiencia"
],
"Votre photo": [
"Your photo",
"Tu foto"
],
"Projets livrés": [
"Projects delivered",
"Proyectos entregados"
],
"Disponibilité": [
"Availability",
"Disponibilidad"
],
"Passionné par": [
"Passionate about",
"Apasionado por"
],
"le code & le design": [
"code & design",
"el código y el diseño"
],
"Bonjour, je m'appelle": [
"Hi, my name is",
"Hola, me llamo"
],
". Développeur freelance depuis 2 ans, je conçois des solutions web sur mesure alliant performance technique et design soigné.": [
". A freelance developer for 2 years, I build custom web solutions that combine technical performance with careful design.",
". Desarrollador freelance desde hace 2 años, creo soluciones web a medida que combinan rendimiento técnico y un diseño cuidado."
],
"Mon approche : comprendre vos besoins avant d'écrire la première ligne de code. Chaque projet mérite une solution unique, pensée pour durer.": [
"My approach: understand your needs before writing the first line of code. Every project deserves a unique solution, built to last.",
"Mi enfoque: entender tus necesidades antes de escribir la primera línea de código. Cada proyecto merece una solución única, pensada para durar."
],
"Ponctualité & respect des délais": [
"Punctual & on schedule",
"Puntualidad y plazos cumplidos"
],
"Code propre, documenté et maintenable": [
"Clean, documented, maintainable code",
"Código limpio, documentado y mantenible"
],
"Communication transparente à chaque étape": [
"Clear communication at every step",
"Comunicación transparente en cada etapa"
],
"Satisfaction client avant tout": [
"Client satisfaction first",
"La satisfacción del cliente ante todo"
],
"Ce que je fais pour vous": [
"What I do for you",
"Lo que hago por ti"
],
"Des solutions web sur mesure, de la conception au déploiement.": [
"Custom web solutions, from design to deployment.",
"Soluciones web a medida, del diseño al despliegue."
],
"Site Vitrine": [
"Showcase Website",
"Web Corporativa"
],
"Un site professionnel qui reflète votre image, responsive et optimisé pour le référencement naturel.": [
"A professional website that reflects your image, responsive and optimised for search engines.",
"Una web profesional que refleja tu imagen, adaptada a móvil y optimizada para buscadores."
],
"Boutique en ligne complète avec gestion des produits, paiement sécurisé et tableau de bord admin.": [
"A complete online shop with product management, secure payment and an admin dashboard.",
"Tienda online completa con gestión de productos, pago seguro y panel de administración."
],
"Application Web": [
"Web Application",
"Aplicación Web"
],
"Applications modernes et performantes — SaaS, outils métiers, dashboards. Architecture robuste et scalable.": [
"Modern, high-performing applications — SaaS, business tools, dashboards. Robust, scalable architecture.",
"Aplicaciones modernas y eficaces — SaaS, herramientas de negocio, paneles. Arquitectura robusta y escalable."
],
"Refonte de Site": [
"Website Redesign",
"Rediseño Web"
],
"Modernisation de votre site — nouveau design, meilleures performances, expérience utilisateur optimisée.": [
"Modernising your website — new design, better performance, an improved user experience.",
"Modernización de tu web — nuevo diseño, mejor rendimiento, experiencia de usuario optimizada."
],
"Intégration Figma": [
"Figma to Code",
"Integración de Figma"
],
"Votre maquette intégrée avec précision au pixel près en code propre et maintenable.": [
"Your mockup built pixel-perfect in clean, maintainable code.",
"Tu maqueta integrada al píxel en código limpio y mantenible."
],
"Maintenance & Support": [
"Maintenance & Support",
"Mantenimiento y Soporte"
],
"Mises à jour, corrections de bugs, sauvegardes et support technique continu après livraison.": [
"Updates, bug fixes, backups and ongoing technical support after launch.",
"Actualizaciones, corrección de errores, copias de seguridad y soporte técnico continuo tras la entrega."
],
"Support": [
"Support",
"Soporte"
],
"Mon processus de travail": [
"How I work",
"Mi proceso de trabajo"
],
"Découverte": [
"Discovery",
"Descubrimiento"
],
"& Brief": [
"& Brief",
"y Brief"
],
"Devis": [
"Quote",
"Presupuesto"
],
"& Planning": [
"& Planning",
"y Planificación"
],
"Design": [
"Design",
"Diseño"
],
"& Maquette": [
"& Mockup",
"y Maqueta"
],
"Développement": [
"Development",
"Desarrollo"
],
"Livraison": [
"Launch",
"Entrega"
],
"& Support": [
"& Support",
"y Soporte"
],
"Mes réalisations": [
"My work",
"Mis proyectos"
],
"Créa": [
"Design",
"Diseño"
],
"Tous": [
"All",
"Todos"
],
"Identité visuelle": [
"Brand identity",
"Identidad visual"
],
"Réseaux sociaux": [
"Social media",
"Redes sociales"
],
"Une sélection de mes projets les plus significatifs.": [
"A selection of my most significant projects.",
"Una selección de mis proyectos más destacados."
],
"Projet principal": [
"Main project",
"Proyecto principal"
],
"XX — Nom du projet principal": [
"XX — Main project name",
"XX — Nombre del proyecto principal"
],
"XX Description courte du projet.": [
"XX Short project description.",
"XX Descripción corta del proyecto."
],
"Voir le site →": [
"View site →",
"Ver la web →"
],
"Projet 2": [
"Project 2",
"Proyecto 2"
],
"Projet 3": [
"Project 3",
"Proyecto 3"
],
"Projet 4": [
"Project 4",
"Proyecto 4"
],
"Projet 5": [
"Project 5",
"Proyecto 5"
],
"XX — Nom du projet": [
"XX — Project name",
"XX — Nombre del proyecto"
],
"XX Description du projet.": [
"XX Project description.",
"XX Descripción del proyecto."
],
"Voir →": [
"View →",
"Ver →"
],
"Projet créa principal": [
"Main design project",
"Proyecto de diseño principal"
],
"Voir le projet →": [
"View project →",
"Ver el proyecto →"
],
"Projet créa 2": [
"Design project 2",
"Proyecto de diseño 2"
],
"Projet créa 3": [
"Design project 3",
"Proyecto de diseño 3"
],
"Projet créa 4": [
"Design project 4",
"Proyecto de diseño 4"
],
"Projet créa 5": [
"Design project 5",
"Proyecto de diseño 5"
],
"Des offres transparentes": [
"Transparent pricing",
"Ofertas transparentes"
],
"Choisissez la formule adaptée à votre projet. Devis gratuit sous 24h.": [
"Choose the package that fits your project. Free quote within 24h.",
"Elige la fórmula adecuada para tu proyecto. Presupuesto gratis en 24 h."
],
"/projet": [
"/project",
"/proyecto"
],
"Idéal pour les indépendants et petites structures qui souhaitent une présence web professionnelle.": [
"Ideal for freelancers and small businesses that want a professional web presence.",
"Ideal para autónomos y pequeñas empresas que quieren una presencia web profesional."
],
"Site vitrine jusqu'à 5 pages": [
"Showcase website up to 5 pages",
"Web corporativa de hasta 5 páginas"
],
"Design responsive & mobile": [
"Responsive & mobile design",
"Diseño responsive y móvil"
],
"Formulaire de contact": [
"Contact form",
"Formulario de contacto"
],
"SEO de base": [
"Basic SEO",
"SEO básico"
],
"Délai estimé : XX semaines": [
"Estimated time: XX weeks",
"Plazo estimado: XX semanas"
],
"Demander un devis": [
"Request a quote",
"Pedir presupuesto"
],
"Recommandé": [
"Recommended",
"Recomendado"
],
"Pour les PME qui veulent un site performant avec des fonctionnalités avancées.": [
"For small companies that want a high-performing site with advanced features.",
"Para pymes que quieren una web eficaz con funciones avanzadas."
],
"Site jusqu'à 10 pages": [
"Website up to 10 pages",
"Web de hasta 10 páginas"
],
"Design sur mesure premium": [
"Premium custom design",
"Diseño a medida premium"
],
"Blog / espace admin": [
"Blog / admin area",
"Blog / panel de administración"
],
"SEO avancé + Analytics": [
"Advanced SEO + Analytics",
"SEO avanzado + Analytics"
],
"Animations & interactions": [
"Animations & interactions",
"Animaciones e interacciones"
],
"Mois de support inclus": [
"Month of support included",
"Mes de soporte incluido"
],
"Sur": [
"Custom",
"A"
],
"devis": [
"quote",
"medida"
],
"Applications complexes, e-commerce, plateformes SaaS ou projets avec besoins spécifiques.": [
"Complex applications, e-commerce, SaaS platforms or projects with specific needs.",
"Aplicaciones complejas, e-commerce, plataformas SaaS o proyectos con necesidades específicas."
],
"Application / E-commerce complet": [
"Full application / E-commerce",
"Aplicación / E-commerce completo"
],
"Back-office & base de données": [
"Back office & database",
"Back-office y base de datos"
],
"Auth & intégrations tierces": [
"Auth & third-party integrations",
"Autenticación e integraciones externas"
],
"Architecture scalable": [
"Scalable architecture",
"Arquitectura escalable"
],
"Accompagnement dédié": [
"Dedicated support",
"Acompañamiento dedicado"
],
"Support long terme": [
"Long-term support",
"Soporte a largo plazo"
],
"Discutons de votre projet": [
"Let's discuss your project",
"Hablemos de tu proyecto"
],
"Vous hésitez ?": [
"Not sure?",
"¿Dudas?"
],
"Contactez-moi": [
"Contact me",
"Contáctame"
],
"pour un appel découverte gratuit de 30 min.": [
"for a free 30-minute discovery call.",
"para una llamada gratuita de 30 min."
],
"Des questions ?": [
"Questions?",
"¿Preguntas?"
],
"Questions fréquentes": [
"Frequently asked questions",
"Preguntas frecuentes"
],
"Comment se passe le paiement ?": [
"How does payment work?",
"¿Cómo funciona el pago?"
],
"50% d'acompte au démarrage du projet, le solde à la livraison. Un échelonnement peut être discuté pour les projets importants.": [
"A 50% deposit when the project starts, the balance on delivery. Instalments can be discussed for larger projects.",
"Un 50 % de anticipo al empezar el proyecto y el resto en la entrega. Para proyectos grandes se puede pagar a plazos."
],
"Combien de révisions sont incluses ?": [
"How many revisions are included?",
"¿Cuántas revisiones están incluidas?"
],
"Chaque forfait inclut XX séries de révisions. Des révisions supplémentaires sont possibles selon un tarif horaire défini à l'avance.": [
"Each package includes XX rounds of revisions. Extra revisions are possible at an hourly rate agreed in advance.",
"Cada fórmula incluye XX rondas de revisiones. Se pueden añadir más con una tarifa por hora acordada de antemano."
],
"Pouvez-vous travailler avec mon équipe existante ?": [
"Can you work with my existing team?",
"¿Puedes trabajar con mi equipo?"
],
"Absolument. J'ai l'habitude de collaborer avec des designers, équipes marketing ou autres développeurs. Je m'adapte à votre organisation.": [
"Absolutely. I'm used to working with designers, marketing teams and other developers. I adapt to how you work.",
"Por supuesto. Estoy acostumbrado a colaborar con diseñadores, equipos de marketing y otros desarrolladores. Me adapto a tu organización."
],
"Proposez-vous hébergement et nom de domaine ?": [
"Do you offer hosting and a domain name?",
"¿Ofreces alojamiento y dominio?"
],
"Je peux conseiller et gérer l'hébergement selon vos besoins (VPS, Vercel, cloud...). Des frais peuvent s'appliquer selon la solution choisie.": [
"I can advise on and manage hosting to suit your needs (VPS, Vercel, cloud...). Fees may apply depending on the option chosen.",
"Puedo asesorarte y gestionar el alojamiento según tus necesidades (VPS, Vercel, cloud...). Puede haber costes según la opción elegida."
],
"Que se passe-t-il après la livraison ?": [
"What happens after launch?",
"¿Qué pasa después de la entrega?"
],
"Je reste disponible pour toute question et propose des forfaits de maintenance mensuelle. Je peux aussi former vos équipes à l'utilisation du site.": [
"I remain available for any questions and offer monthly maintenance plans. I can also train your team to use the site.",
"Sigo disponible para cualquier duda y ofrezco planes de mantenimiento mensual. También puedo formar a tu equipo en el uso de la web."
],
"Quel est le délai moyen d'un projet ?": [
"How long does a project usually take?",
"¿Cuánto tarda un proyecto de media?"
],
"Un site vitrine prend en général 2 à 4 semaines. Un projet plus complexe peut nécessiter 6 à 12 semaines selon les fonctionnalités.": [
"A showcase website usually takes 2 to 4 weeks. A more complex project can take 6 to 12 weeks depending on the features.",
"Una web corporativa suele tardar de 2 a 4 semanas. Un proyecto más complejo puede necesitar de 6 a 12 semanas según las funciones."
],
"Travaillez-vous avec des CMS ?": [
"Do you work with CMSs?",
"¿Trabajas con CMS?"
],
"Oui, je travaille avec WordPress, Webflow, ou des solutions sur-mesure selon vos besoins et votre niveau d'autonomie souhaité.": [
"Yes, I work with WordPress, Webflow or custom solutions, depending on your needs and how independent you want to be.",
"Sí, trabajo con WordPress, Webflow o soluciones a medida según tus necesidades y la autonomía que quieras."
],
"Mon site sera-t-il optimisé pour le SEO ?": [
"Will my site be optimised for SEO?",
"¿Mi web estará optimizada para SEO?"
],
"Oui, les bonnes pratiques SEO sont intégrées dès le développement : balises, performances, accessibilité et structure sémantique.": [
"Yes, SEO best practice is built in from the start: tags, performance, accessibility and semantic structure.",
"Sí, las buenas prácticas SEO se integran desde el desarrollo: etiquetas, rendimiento, accesibilidad y estructura semántica."
],
"Le site sera-t-il responsive ?": [
"Will the site be responsive?",
"¿La web será responsive?"
],
"Absolument. Chaque site est conçu pour fonctionner parfaitement sur mobile, tablette et desktop.": [
"Absolutely. Every site is built to work perfectly on mobile, tablet and desktop.",
"Por supuesto. Cada web está diseñada para funcionar perfectamente en móvil, tablet y ordenador."
],
"Comment se déroule le premier contact ?": [
"How does the first contact work?",
"¿Cómo es el primer contacto?"
],
"Un appel découverte gratuit de 30 minutes pour comprendre votre projet, vos besoins et vous proposer une solution adaptée.": [
"A free 30-minute discovery call to understand your project and needs, and suggest the right solution.",
"Una llamada gratuita de 30 minutos para entender tu proyecto y tus necesidades, y proponerte una solución adecuada."
],
"Démarrons votre projet": [
"Let's start your project",
"Empecemos tu proyecto"
],
"Une idée ? Un projet ? Je réponds sous": [
"An idea? A project? I reply within",
"¿Una idea? ¿Un proyecto? Respondo en"
],
"et propose un appel découverte gratuit de 30 min.": [
"and offer a free 30-minute discovery call.",
"y propongo una llamada gratuita de 30 min."
],
"Localisation": [
"Location",
"Ubicación"
],
"Remote disponible partout en France": [
"Available remotely across France",
"Disponible en remoto en toda Francia"
],
"Disponible dès le": [
"Available from",
"Disponible desde el"
],
"Parlez-moi de votre projet": [
"Tell me about your project",
"Háblame de tu proyecto"
],
"Réponse sous 24h. Les champs marqués d’un * sont obligatoires.": [
"Reply within 24h. Fields marked * are required.",
"Respuesta en 24 h. Los campos con * son obligatorios."
],
"Prénom *": [
"First name *",
"Nombre *"
],
"Nom *": [
"Last name *",
"Apellido *"
],
"Téléphone": [
"Phone",
"Teléfono"
],
"(facultatif)": [
"(optional)",
"(opcional)"
],
"Type de projet": [
"Project type",
"Tipo de proyecto"
],
"Site vitrine": [
"Showcase website",
"Web corporativa"
],
"Application web": [
"Web application",
"Aplicación web"
],
"Refonte de site": [
"Website redesign",
"Rediseño web"
],
"Autre": [
"Other",
"Otro"
],
"Budget approximatif": [
"Approximate budget",
"Presupuesto aproximado"
],
"Moins de 500€": [
"Under €500",
"Menos de 500 €"
],
"+ de 5 000€": [
"Over €5,000",
"Más de 5.000 €"
],
"À discuter": [
"To discuss",
"A hablar"
],
"Votre message *": [
"Your message *",
"Tu mensaje *"
],
"Envoyer le message": [
"Send message",
"Enviar mensaje"
],
"Vos informations servent uniquement à répondre à votre demande.": [
"Your details are only used to reply to your request.",
"Tus datos solo se usan para responder a tu solicitud."
],
"Message envoyé ! Je vous réponds sous 24h.": [
"Message sent! I'll reply within 24h.",
"¡Mensaje enviado! Te respondo en 24 h."
],
"Développeur Full Stack Freelance": [
"Freelance Full Stack Developer",
"Desarrollador Full Stack Freelance"
],
"basé à Béziers, disponible en remote.": [
"based in Béziers, available remotely.",
"en Béziers, disponible en remoto."
],
"Navigation": [
"Navigation",
"Navegación"
],
"Infos": [
"Info",
"Información"
],
"Mentions légales": [
"Legal notice",
"Aviso legal"
],
"© 2026 Bouaziz Mohamed — Tous droits réservés": [
"© 2026 Bouaziz Mohamed — All rights reserved",
"© 2026 Bouaziz Mohamed — Todos los derechos reservados"
],
"Fait avec": [
"Made with",
"Hecho con"
],
"à Béziers": [
"in Béziers",
"en Béziers"
],
"Retour en haut": [
"Back to top",
"Volver arriba"
],
"Univers": [
"Category",
"Universo"
],
"Dupont": [
"Smith",
"García"
],
"Jean": [
"John",
"Juan"
],
"jean@exemple.com": [
"john@example.com",
"juan@ejemplo.com"
],
"Décrivez votre projet en quelques lignes : votre activité, ce que vous voulez, vos délais...": [
"Describe your project in a few lines: your business, what you want, your timeline...",
"Describe tu proyecto en pocas líneas: tu actividad, lo que quieres, tus plazos..."
],
"amour": [
"love",
"amor"
]
};

const LANG_INDEX = { en: 0, es: 1 };
const originalText = new WeakMap();
const ATTRS = ['placeholder', 'title', 'aria-label'];

function translatePage(lang) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script, style, svg, .lang-picker')) continue;
    if (!originalText.has(node)) originalText.set(node, node.textContent);
    const original = originalText.get(node);
    const key = original.replace(/\s+/g, ' ').trim();
    const entry = TRANSLATIONS[key];
    if (!entry) continue;
    const value = lang === 'fr' ? key : entry[LANG_INDEX[lang]];
    const lead = original.match(/^\s*/)[0], trail = original.match(/\s*$/)[0];
    node.textContent = lead + value + trail;
  }
  document.querySelectorAll(ATTRS.map(a => `[${a}]`).join(',')).forEach(el => {
    if (el.closest('.lang-picker')) return;
    ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      const store = 'orig' + a.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, m => m.toUpperCase());
      if (!el.dataset[store]) el.dataset[store] = el.getAttribute(a);
      const key = el.dataset[store];
      const entry = TRANSLATIONS[key];
      el.setAttribute(a, lang === 'fr' || !entry ? key : entry[LANG_INDEX[lang]]);
    });
  });
  document.documentElement.lang = lang;
}

const langPicker = document.getElementById('langPicker');
const langCurrent = document.getElementById('langCurrent');
const langMenu = document.getElementById('langMenu');

function setLang(lang) {
  translatePage(lang);
  const btn = langMenu.querySelector(`[data-lang="${lang}"]`);
  document.getElementById('langCurrentFlag').innerHTML = btn.querySelector('.flag').innerHTML;
  langMenu.querySelectorAll('button').forEach(b => b.classList.toggle('is-current', b === btn));
  try { localStorage.setItem('site-lang', lang); } catch (e) {}
}

function toggleLangMenu(open) {
  langMenu.hidden = !open;
  langCurrent.setAttribute('aria-expanded', open ? 'true' : 'false');
}

langCurrent.addEventListener('click', e => { e.stopPropagation(); toggleLangMenu(langMenu.hidden); });
langMenu.addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if (!b) return;
  setLang(b.dataset.lang);
  toggleLangMenu(false);
});
document.addEventListener('click', e => { if (!langPicker.contains(e.target)) toggleLangMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleLangMenu(false); });

let savedLang = 'fr';
try { savedLang = localStorage.getItem('site-lang') || 'fr'; } catch (e) {}
setLang(['fr', 'en', 'es'].includes(savedLang) ? savedLang : 'fr');
