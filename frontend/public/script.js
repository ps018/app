/* ============================================================
   Dr. Richa Sinha — Periodontics & Implantology
   Vanilla JS: smooth scroll, nav, before/after slider,
   form validation + EmailJS submission handler.
   ============================================================ */


/* ============================================================
   1. EMAILJS CONFIGURATION  —  LIVE
   ------------------------------------------------------------
   LIVE — integrated (see EMAILJS-SETUP.md if keys ever change).
   SERVICE_ID   : EmailJS Dashboard → Email Services
   TEMPLATE_ID  : "Send inquiry" template → doctor's inbox
   AUTOREPLY_ID : auto-reply template → visitor's inbox
   PUBLIC_KEY   : EmailJS Dashboard → Account → Keys
   ============================================================ */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "PLXf-2xvGiN-R78no",
  SERVICE_ID: "service_54gl2uu",
  TEMPLATE_ID: "template_mehiq6z",           // "Send inquiry" → doctor's inbox
  AUTOREPLY_TEMPLATE_ID: "template_3ulgtnn", // auto-reply → visitor (sent by EmailJS dashboard auto-reply on the inquiry template — never from code, or replies go out twice)
};

// Template variables expected by both templates ({{...}}):
//   full_name, phone, email, service, message
// "Send inquiry" template: To Email = doctor's address, Reply-To = {{email}}
// Auto-reply template:     To Email = {{email}} (the visitor's address)

const emailJsConfigured = () =>
  Object.values(EMAILJS_CONFIG).every((v) => v && !v.startsWith("YOUR_"));

/* ------------------------------------------------------------
   BACKEND FETCH PLACEHOLDER (optional)
   If you later prefer your own backend instead of EmailJS,
   replace the sendWithBackend() body with your API endpoint:
   ------------------------------------------------------------ */
async function sendWithBackend(formData) {
  // Example — point this at your own endpoint when available:
  // const res = await fetch("https://api.your-domain.com/api/inquiries", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(Object.fromEntries(formData)),
  // });
  // if (!res.ok) throw new Error("Backend error " + res.status);
  // return res;
  throw new Error("Backend endpoint not configured");
}

/* ============================================================ */

(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Toasts ---------------- */
  function showToast(message, type = "info", ms = 4200) {
    const root = $("#toastRoot");
    if (!root) return;
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.setAttribute("data-testid", "toast");
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, ms);
  }

  /* ---------------- Smooth scrolling (Lenis) ---------------- */
  let lenis = null;
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof window.Lenis === "undefined") return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -84, duration: 1.2 });
    else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  // Intercept all in-page anchors (nav, drawer, footer, service links…)
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      closeDrawer();
      scrollToTarget(hash);
      history.replaceState(null, "", hash);
    });
  });

  /* ---------------- Header state + progress ---------------- */
  const header = $("#siteHeader");
  const progressBar = $("#progressBar");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
    if (!prefersReducedMotion) parallax(y);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Parallax (hero) ---------------- */
  const heroImg = $("#heroImage");
  const floats = $$(".float-card");
  function parallax(y) {
    if (y > window.innerHeight * 1.4) return;
    if (heroImg) heroImg.style.transform = `translateY(${y * 0.06}px) scale(1.06)`;
    floats.forEach((f, i) => { f.style.translate = `0 ${y * (i ? 0.05 : -0.04)}px`; });
  }

  /* ---------------- Mobile drawer ---------------- */
  const drawer = $("#mobileDrawer");
  const navToggle = $("#navToggle");
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (navToggle && drawer) {
    navToggle.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      drawer.setAttribute("aria-hidden", String(!open));
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  }

  /* ---------------- Active nav link ---------------- */
  const sectionMap = [
    ["home", "nav-link-home"], ["about", "nav-link-about"],
    ["specializations", "nav-link-specializations"], ["cases", "nav-link-cases"],
    ["contact", "nav-link-contact"],
  ];
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const hit = sectionMap.find(([id]) => en.target.id === id);
      if (!hit) return;
      $$(".nav-link").forEach((l) => l.classList.remove("is-active"));
      const link = $(`[data-testid="${hit[1]}"]`);
      if (link) link.classList.add("is-active");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sectionMap.forEach(([id]) => { const s = document.getElementById(id); if (s) secObs.observe(s); });

  /* ---------------- Scroll reveal ---------------- */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in-view"); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => revObs.observe(el));

  /* ---------------- Animated counters ---------------- */
  const fmt = (v, dec, comma) =>
    comma ? Math.round(v).toLocaleString("en-IN") : v.toFixed(dec);
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      cntObs.unobserve(en.target);
      const el = en.target;
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const comma = el.dataset.comma === "true";
      if (prefersReducedMotion) { el.textContent = fmt(end, dec, comma) + suffix; return; }
      const t0 = performance.now(), dur = 1600;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * eased, dec, comma) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  $$("[data-count]").forEach((el) => cntObs.observe(el));

  /* ---------------- Marquee (duplicate track once for a seamless loop) ---------------- */
  const inner = $("#marqueeInner");
  if (inner && !prefersReducedMotion) {
    const clone = inner.firstElementChild.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    inner.appendChild(clone);
  }

  /* ============================================================
     BEFORE / AFTER COMPARISON SLIDER
     ============================================================ */
  function initSlider(slider) {
    const after = $(".ba-after", slider);
    const handle = $(".ba-handle", slider);
    if (!after || !handle) return;

    let pos = 50;
    const apply = (v) => {
      pos = Math.max(0, Math.min(100, v));
      after.style.clipPath = `inset(0 0 0 ${pos}%)`;
      handle.style.left = `${pos}%`;
      handle.setAttribute("aria-valuenow", Math.round(pos));
    };
    apply(50);

    const fromEvent = (e) => {
      const r = slider.getBoundingClientRect();
      apply(((e.clientX - r.left) / r.width) * 100);
    };

    let dragging = false;
    slider.addEventListener("pointerdown", (e) => {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    slider.addEventListener("pointermove", (e) => { if (dragging) fromEvent(e); });
    const stop = () => { dragging = false; };
    slider.addEventListener("pointerup", stop);
    slider.addEventListener("pointercancel", stop);

    handle.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 10 : 4;
      if (e.key === "ArrowLeft") { apply(pos - step); e.preventDefault(); }
      if (e.key === "ArrowRight") { apply(pos + step); e.preventDefault(); }
      if (e.key === "Home") { apply(0); e.preventDefault(); }
      if (e.key === "End") { apply(100); e.preventDefault(); }
    });

    // One-time nudge when first visible, to invite the drag
    const nudgeObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        nudgeObs.unobserve(slider);
        if (prefersReducedMotion) return;
        const seq = [[50, 300], [66, 500], [42, 900], [50, 1300]];
        seq.forEach(([v, t]) => setTimeout(() => { if (!dragging) apply(v); }, t));
      });
    }, { threshold: 0.5 });
    nudgeObs.observe(slider);
  }

  $$(".ba-slider").forEach(initSlider);

  // Case tabs
  $$(".ba-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const idx = tab.dataset.case;
      $$(".ba-tab").forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      $$(".ba-wrap").forEach((w) => {
        const show = w.dataset.testid === `ba-case-${idx}`;
        if (show === w.classList.contains("hidden")) {
          w.classList.add("is-switching");
          setTimeout(() => {
            w.classList.toggle("hidden", !show);
            w.classList.remove("is-switching");
          }, 180);
        }
      });
    });
  });

  /* ============================================================
     INQUIRY / APPOINTMENT FORM — validation + EmailJS
     ============================================================ */
  const form = $("#appointmentForm");
  const formSuccess = $("#formSuccess");
  const formStatus = $("#formStatus");
  const submitBtn = $("#submitBtn");
  const submitLabel = $("#submitLabel");
  const submitSpinner = $("#submitSpinner");
  const demoNote = $("#demoNote");

  const rules = {
    fullName: {
      test: (v) => v.trim().length >= 2,
      msg: "Please enter your full name.",
    },
    phone: {
      test: (v) => /^[+]?[\d\s\-().]{9,17}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 10,
      msg: "Enter a valid phone number (at least 10 digits).",
    },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      msg: "Enter a valid email address, e.g. name@example.com.",
    },
    service: {
      test: (v) => v !== "",
      msg: "Please choose a service.",
    },
    message: {
      test: (v) => v.trim().length >= 5,
      msg: "Please describe your inquiry (a few words).",
    },
  };

  function setError(id, msg) {
    const input = $("#" + id);
    const field = input.closest(".field");
    const errorEl = $(`[data-error-for="${id}"]`);
    field.classList.toggle("has-error", !!msg);
    if (errorEl) errorEl.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validateForm() {
    let firstBad = null;
    Object.keys(rules).forEach((id) => {
      const input = $("#" + id);
      if (!input) return;
      const ok = rules[id].test(input.value, form);
      setError(id, ok ? "" : rules[id].msg);
      if (!ok && !firstBad) firstBad = id;
    });
    return firstBad === null;
  }

  // Live re-validation once a field was marked
  Object.keys(rules).forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) {
        setError(id, rules[id].test(input.value, form) ? "" : rules[id].msg);
      }
    });
  });

  function setSending(state) {
    submitBtn.disabled = state;
    submitLabel.textContent = state ? "Sending…" : "Submit Inquiry";
    submitSpinner.classList.toggle("hidden", !state);
  }

  function showSuccess(demo) {
    form.classList.add("hidden");
    formSuccess.classList.remove("hidden");
    if (demo) demoNote.classList.remove("hidden");
    formSuccess.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  }

  if (form) {
    let submitting = false;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (submitting) return; // hard guard: blocks double-submit (Enter spam, queued events)

      // Honeypot: silently drop bot submissions
      if (form.company_website && form.company_website.value.trim() !== "") return;

      formStatus.textContent = "";
      if (!validateForm()) {
        formStatus.innerHTML = '<span class="text-[#C74B3D]">Please fix the highlighted fields and try again.</span>';
        const bad = $(".field.has-error input, .field.has-error select, .field.has-error textarea");
        if (bad) bad.focus();
        showToast("Some details need attention — check the highlighted fields.", "error");
        return;
      }

      submitting = true;
      setSending(true);

      try {
        if (emailJsConfigured()) {
          // --- LIVE SEND via EmailJS (field "name" attributes map to template variables) ---
          await window.emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form, {
            publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
            limitRate: { id: "appointment-form", throttle: 10000 },
          });
          // Auto-reply to the visitor is sent server-side by EmailJS:
          // the "Send inquiry" template (template_mehiq6z) has its built-in
          // Auto-Reply enabled, pointing at template_3ulgtnn. Do NOT call
          // emailjs.send with that template here, or visitors get it twice.
          showToast("Inquiry sent — Dr. Sinha will get back to you shortly.", "success");
        } else {
          // --- DEMO MODE (no keys yet): simulate + surface the fallback path ---
          console.info("[EmailJS] Demo mode — add PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID in script.js to enable live email delivery.");
          await new Promise((r) => setTimeout(r, 900));
          try { await sendWithBackend(new FormData(form)); } catch { /* placeholder endpoint not configured */ }
          showToast("Validated in demo mode — connect EmailJS keys to deliver live email.", "info", 6000);
        }
        showSuccess(!emailJsConfigured());
        form.reset();
      } catch (err) {
        console.error("[EmailJS] submission failed:", err);
        formStatus.innerHTML = '<span class="text-[#C74B3D]">We couldn\'t send your inquiry. Please try again, or call +91 9980901103.</span>';
        showToast("Sending failed — please retry or call +91 9980901103.", "error");
      } finally {
        submitting = false;
        setSending(false);
      }
    });

    $("#resetFormBtn").addEventListener("click", () => {
      formSuccess.classList.add("hidden");
      demoNote.classList.add("hidden");
      form.classList.remove("hidden");
      formStatus.textContent = "";
      $("#fullName").focus();
    });
  }

  /* ---------------- Modals ---------------- */
  let lastFocus = null;
  $$("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById(`modal-${btn.dataset.modalOpen}`);
      if (!modal) return;
      lastFocus = btn;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $(".modal-close", modal).focus();
    });
  });
  function closeModals() {
    $$(".modal-overlay.is-open").forEach((m) => {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    });
  }
  $$("[data-modal-close]").forEach((b) => b.addEventListener("click", closeModals));
  $$(".modal-overlay").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModals(); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });

  /* ---------------- Footer year ---------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Init ---------------- */
  initSmoothScroll();
  onScroll();
})();
