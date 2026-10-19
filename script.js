/**
 * LaunchPoint Growth — Portfolio interactions
 */

(function () {
  "use strict";

  // ---------- Year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header scroll ----------
  const header = document.getElementById("header");
  const backTop = document.getElementById("backTop");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (backTop) backTop.classList.toggle("visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Mobile menu ----------
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ---------- Scroll reveal ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ---------- Counter animation ----------
  const counters = document.querySelectorAll(".counter");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length && "IntersectionObserver" in window) {
    const counterIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterIo.observe(c));
  }

  // ---------- Portfolio filter ----------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");

      workCards.forEach((card) => {
        const cats = (card.getAttribute("data-category") || "").split(/\s+/);
        const show = filter === "all" || cats.includes(filter);
        card.classList.toggle("hidden", !show);
        if (show) {
          card.classList.remove("visible");
          // re-trigger reveal
          requestAnimationFrame(() => {
            card.classList.add("visible");
          });
        }
      });
    });
  });

  // ---------- Project modal ----------
  const projects = {
    1: {
      title: "NovaPay — Category positioning",
      tags: ["Strategy", "Positioning"],
      desc: "Repositioned a fintech startup for the SME segment. We rebuilt the narrative across website, sales decks, and outreach so every touchpoint spoke to the same value story. The result was clearer pipeline conversations and stronger win rates in the target segment.",
      outcome: "Clearer ICP fit & higher win rate",
      focus: "Positioning · Narrative · Sales enablement",
      art: "linear-gradient(145deg, #1a3d28, #0d2818)",
    },
    2: {
      title: "GreenCart — Organic demand engine",
      tags: ["SEO", "Content"],
      desc: "Designed and launched a content and SEO system focused on high-intent queries. Editorial calendar, on-page structure, and measurement reduced reliance on paid acquisition while growing qualified organic traffic month over month.",
      outcome: "Sustainable organic pipeline growth",
      focus: "SEO · Content · Analytics",
      art: "linear-gradient(145deg, #143528, #0a1f14)",
    },
    3: {
      title: "PulseHR — Pipeline redesign",
      tags: ["Sales", "Paid media"],
      desc: "Aligned paid acquisition with a redesigned sales process. New qualification criteria, stage definitions, and handoff rules improved lead quality. Sales and marketing shared one definition of a good opportunity.",
      outcome: "Better lead quality & close rates",
      focus: "Pipeline · Paid · Conversion",
      art: "linear-gradient(160deg, #1f3d2a, #122418)",
    },
    4: {
      title: "Atlas Labs — Pricing & packaging",
      tags: ["Pricing", "Research"],
      desc: "Research-led pricing and packaging project. Customer interviews, competitor mapping, and value metric analysis produced a clearer tier structure and messaging that supported larger average deal sizes.",
      outcome: "Higher average deal size",
      focus: "Research · Pricing · Packaging",
      art: "linear-gradient(135deg, #183528, #0e2218)",
    },
    5: {
      title: "Lumen — Go-to-market launch",
      tags: ["Brand", "Launch"],
      desc: "End-to-end go-to-market for a product launch: messaging framework, site narrative, outbound sequences, and coordinated launch campaigns. One system from first impression to first conversation.",
      outcome: "Cohesive launch & early pipeline",
      focus: "GTM · Brand · Campaigns",
      art: "linear-gradient(150deg, #1c3a28, #0f2419)",
    },
    6: {
      title: "Forge — Retention playbook",
      tags: ["Retention", "Success"],
      desc: "Client success rhythms, health scoring, and expansion messaging. The playbook helped the team protect renewals and surface upsell opportunities without adding noise to the customer relationship.",
      outcome: "Improved renewal & expansion",
      focus: "Success · Retention · Expansion",
      art: "linear-gradient(145deg, #163024, #0c1e14)",
    },
  };

  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalOutcome = document.getElementById("modalOutcome");
  const modalFocus = document.getElementById("modalFocus");
  const modalArt = document.getElementById("modalArt");

  function openModal(id) {
    const p = projects[id];
    if (!p || !modal) return;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalOutcome.textContent = p.outcome;
    modalFocus.textContent = p.focus;
    modalTags.innerHTML = p.tags.map((t) => `<span>${t}</span>`).join("");
    modalArt.style.background = p.art;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".work-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn.getAttribute("data-project"));
    });
  });

  if (modal) {
    modal.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  // ---------- Contact form ----------
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const need = form.need.value;
      const message = form.message.value.trim();

      const subject = encodeURIComponent(`Growth enquiry — ${need || "General"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${need}\n\nGoals:\n${message}`
      );
      window.location.href = `mailto:hello@launchpointgrowth.example?subject=${subject}&body=${body}`;

      if (formNote) {
        formNote.textContent = "Opening your email app… If nothing happens, email us at hello@launchpointgrowth.example";
        formNote.style.color = "var(--lime)";
      }
    });
  }

  // ---------- Smooth active nav (optional polish) ----------
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute("id");
      }
    });
    navAnchors.forEach((a) => {
      const href = a.getAttribute("href");
      if (href === "#" + current) {
        a.style.color = "var(--white)";
      } else if (!a.classList.contains("nav-cta")) {
        a.style.color = "";
      }
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
})();
