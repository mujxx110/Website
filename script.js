const siteMenu = document.querySelector(".header__menu[data-nav-page]");

const navigationItems = [
  { id: "home", href: "index.html", label: "Home" },
  { id: "platform", href: "platform.html", label: "Platform" },
  { id: "partnerships", href: "partnerships.html", label: "Partnerships" },
  { id: "insights", href: "insights.html", label: "Insights" },
  {
    id: "research",
    href: "research-evidence.html",
    label: "Clinical Evidence",
  },
  { id: "about", href: "about.html", label: "About" },
  { id: "contact", href: "contact.html", label: "Contact" },
];

const buildNavigationMarkup = (currentPage) => {
  const linksMarkup = navigationItems
    .map(
      ({ id, href, label }) =>
        `              <li><a data-nav-id="${id}"${
          id === currentPage ? ' class="is-active"' : ""
        } href="${href}">${label}</a></li>`
    )
    .join("\n");

  return `
          <nav class="site-nav" aria-label="Primary">
            <ul>
${linksMarkup}
            </ul>
          </nav>
          <a class="button button--blue header__cta" href="contact.html#request-demo">
            Request a Demo
          </a>
        `;
};

if (siteMenu) {
  const currentPage = siteMenu.dataset.navPage;
  if (!siteMenu.querySelector(".site-nav")) {
    siteMenu.innerHTML = buildNavigationMarkup(currentPage);
  }

  siteMenu.querySelectorAll("[data-nav-id]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navId === currentPage);
  });
}

const toggle = document.querySelector(".header__toggle");
const menu = document.querySelector(".header__menu");
const navLinks = document.querySelectorAll(".site-nav a, .header__cta");
const siteHeader = document.querySelector(".site-header");
const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const motionSurfaceSelector =
  ".info-card, .step-card, .platform-card, .feedback-card, .platform-panel, .platform-compare-card, .conversation-card, .partnership-panel, .partnership-sidecard, .article-card, .topic-card, .event-card, .publication-card, .research-setting-card, .about-founder-panel, .about-founder-stats, .about-stage-card, .contact-inquiry-panel, .contact-card, .definition-card, .research-methodology-panel, .footer__note, .platform-cta-band__inner, .about-cta-band__inner, .current-stage__inner, .research-collaboration__inner, .insights-quote, .research-regulatory__note, .platform-note, .blog-feature, .blog-sidebar__card, .blog-article, .faq-item, .related-article-card, .blog-note";

document.querySelectorAll(motionSurfaceSelector).forEach((element) => {
  element.classList.add("motion-surface");
});

if (toggle && menu) {
  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Close" : "Menu";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

const syncHeaderState = () => {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0;

  root.style.setProperty("--scroll-progress", progress.toFixed(4));

  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if (!prefersReducedMotion.matches) {
  document.body.classList.add("has-motion");
  const motionSurfaces = document.querySelectorAll(".motion-surface");

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.16,
            rootMargin: "0px 0px -10% 0px",
          }
        )
      : null;

  const registerMotion = (
    selector,
    variant = "rise",
    { baseDelay = 0, step = 80, cycle = 6 } = {}
  ) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.dataset.motionReady === "true") {
        return;
      }

      element.dataset.motionReady = "true";
      element.classList.add("motion-reveal", `motion-reveal--${variant}`);
      element.style.setProperty(
        "--motion-delay",
        `${baseDelay + (index % cycle) * step}ms`
      );

      if (observer) {
        observer.observe(element);
      } else {
        element.classList.add("is-visible");
      }
    });
  };

  if (prefersFinePointer.matches) {
    motionSurfaces.forEach((surface) => {
      const resetGlow = () => {
        surface.style.setProperty("--surface-glow-x", "50%");
        surface.style.setProperty("--surface-glow-y", "14%");
      };

      resetGlow();

      surface.addEventListener("pointermove", (event) => {
        const bounds = surface.getBoundingClientRect();
        const glowX = ((event.clientX - bounds.left) / bounds.width) * 100;
        const glowY = ((event.clientY - bounds.top) / bounds.height) * 100;

        surface.style.setProperty("--surface-glow-x", `${glowX.toFixed(2)}%`);
        surface.style.setProperty("--surface-glow-y", `${glowY.toFixed(2)}%`);
      });

      surface.addEventListener("pointerleave", resetGlow);
      surface.addEventListener("pointercancel", resetGlow);
    });
  }

  registerMotion(".meta-bar__inner > *", "down", {
    baseDelay: 30,
    step: 60,
    cycle: 3,
  });
  registerMotion(".brand, .site-nav li, .header__cta", "down", {
    baseDelay: 70,
    step: 45,
    cycle: 8,
  });
  registerMotion(".hero__content > .eyebrow", "rise", {
    baseDelay: 70,
    step: 60,
    cycle: 2,
  });
  registerMotion(".hero__title > *", "rise", {
    baseDelay: 110,
    step: 65,
    cycle: 8,
  });
  registerMotion(".hero__content > .hero__lede", "rise", {
    baseDelay: 200,
    step: 70,
    cycle: 2,
  });
  registerMotion(".blog-hero__copy > *", "rise", {
    baseDelay: 80,
    step: 75,
    cycle: 6,
  });
  registerMotion(".hero__actions > *", "rise", {
    baseDelay: 240,
    step: 70,
    cycle: 4,
  });
  registerMotion(".hero__content > .text-link", "rise", {
    baseDelay: 300,
    step: 90,
    cycle: 4,
  });
  registerMotion(".hero__details .detail-group", "right", {
    baseDelay: 180,
    step: 70,
    cycle: 6,
  });
  registerMotion(".metrics-strip__grid > *", "soft", {
    baseDelay: 50,
    step: 70,
    cycle: 4,
  });
  registerMotion(".section-intro--split > div:first-child", "left", {
    baseDelay: 40,
    step: 60,
    cycle: 4,
  });
  registerMotion(".section-intro--split > div:last-child", "right", {
    baseDelay: 100,
    step: 60,
    cycle: 4,
  });
  registerMotion(
    ".section-intro:not(.section-intro--split) > *, .about-purpose__inner > *, .platform-positioning > *, .partnerships-conversations__intro > *, .partnerships-dark__grid > *, .partnerships-cta__inner > *, .insights-events__cta, .section-cta",
    "rise",
    {
      baseDelay: 50,
      step: 75,
      cycle: 6,
    }
  );
  registerMotion(
    ".definition-card__content, .platform-card__content, .insight-panel__headline, .partnership-panel__content, .research-methodology-panel__intro, .about-founder-panel__intro, .contact-inquiry-panel__intro",
    "left",
    {
      baseDelay: 50,
      step: 60,
      cycle: 5,
    }
  );
  registerMotion(
    ".definition-card__copy, .feedback-card, .insight-panel__copy, .partnership-sidecard, .research-methodology-panel__list, .about-founder-stats, .contact-intake-embed",
    "right",
    {
      baseDelay: 110,
      step: 70,
      cycle: 5,
    }
  );
  registerMotion(
    ".card-grid > *, .platform-positioning__cards > *, .insights-event-grid > *, .insights-topic-grid > *, .research-publication-grid > *, .research-settings > *, .about-stage-grid > *, .contact-card-grid > *",
    "zoom",
    {
      baseDelay: 40,
      step: 70,
      cycle: 6,
    }
  );
  registerMotion(
    ".platform-panel__grid > *, .partnership-panel > *, .research-regulatory__grid > *, .about-founder-panel__grid > *, .contact-inquiry-panel__grid > *",
    "soft",
    {
      baseDelay: 40,
      step: 70,
      cycle: 4,
    }
  );
  registerMotion(
    ".platform-note, .research-regulatory__note, .footer__note, .insights-quote, .blog-post-placeholder__article",
    "soft",
    {
      baseDelay: 80,
      step: 70,
      cycle: 5,
    }
  );
  registerMotion(".blog-sidebar__card, .blog-related__grid > *", "soft", {
    baseDelay: 70,
    step: 75,
    cycle: 5,
  });
  registerMotion(".blog-article__intro, .blog-section, .faq-list > *", "rise", {
    baseDelay: 80,
    step: 65,
    cycle: 6,
  });
  registerMotion(".event-card__chips span", "zoom", {
    baseDelay: 140,
    step: 50,
    cycle: 4,
  });
  registerMotion(
    ".current-stage__inner > *, .platform-cta-band__inner > *, .about-cta-band__inner > *, .research-collaboration__inner > *, .blog-post-placeholder__article > *",
    "rise",
    {
      baseDelay: 70,
      step: 90,
      cycle: 6,
    }
  );
  registerMotion(".footer__top > *, .footer__bottom > *", "rise", {
    baseDelay: 50,
    step: 70,
    cycle: 6,
  });
  registerMotion(
    ".contact-inquiry-list li, .platform-panel__list li, .platform-compare-card li, .feedback-card li, .partnership-sidecard li, .research-methodology-panel__list li, .about-founder-stats li",
    "left",
    {
      baseDelay: 120,
      step: 50,
      cycle: 6,
    }
  );
  registerMotion(
    ".blog-checklist li, .blog-question-block p, .related-article-card a",
    "left",
    {
      baseDelay: 110,
      step: 55,
      cycle: 6,
    }
  );
}
