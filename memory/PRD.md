# PRD — Dr. Aditi Deshmukh, MDS — Periodontics & Implantology (Single-Page Website)

## Original Problem Statement
Build a clean, professional, modern, fully responsive single-page website for a dentist specializing in Periodontics and Implantology. Tech: HTML + Tailwind CSS + vanilla JS + EmailJS; static hosting (Vercel/Netlify) ready; working email submission system with EmailJS config boilerplate. Sections: sticky nav, high-converting hero with trust badges, about/credentials, specialized services (Dental Implants / Periodontal Care / Preventive Maintenance & Oral Surgery), interactive before/after drag comparison slider with clinical notes, validated inquiry & appointment form (date/time as range) with EmailJS boilerplate, contact & location (Mon–Sun, Thane/Mumbai/Navi Mumbai), footer with disclaimer + privacy. Deliverables: index.html, script.js, EmailJS setup guide, domain/hosting guide.

## User Choices (from ask_human)
- Identity: editable placeholder "Dr. Aditi Deshmukh, MDS — Periodontics & Implantology"
- Contacts: styled placeholders (+91 98XXX XXXXX / hello@drname.com)
- Accent: soft gold (#C5A059) on clinical teal/blue
- Imagery: real professional stock photos for hero/about

## Architecture
- 100% static site: /app/frontend/public/{index.html, styles.css, script.js, favicon.svg}
- Tailwind via Play CDN + inline config; custom CSS in styles.css
- Lenis CDN for momentum smooth scroll; vanilla IntersectionObserver reveals; no React in the deliverable
- React dev-server shell (src/App.js) renders null so the preview serves the static page
- EmailJS Browser SDK v4 (CDN): emailjs.sendForm with SERVICE_ID/TEMPLATE_ID/PUBLIC_KEY constants at top of script.js; demo mode until keys are pasted; honeypot + 10s rate limit; commented backend fetch() placeholder
- Guides: /app/EMAILJS-SETUP.md, /app/DOMAIN-HOSTING-GUIDE.md

## Core Requirements (static)
1. Sticky glass nav + mobile drawer — done
2. Kinetic hero: masked line-by-line reveal, trust badges, dual CTA, parallax portrait arch — done
3. Slow editorial marquee (single DOM source, JS-cloned track) — done
4. About: credentials, philosophy quote, animated stat band — done
5. Specializations: 3 pillars with exact user-specified treatments — done
6. Before/after drag/swipe slider, keyboard accessible, 3 cases with clinical note overlays — done (SVG clinical diagrams per brief)
7. Appointment form: full validation (email/phone/date-range/time-range), EmailJS boilerplate — done
8. Contact strip: Mon–Sun hours, 3 location cards, tel/mailto links — done
9. Footer: quick links, medical disclaimer + privacy policy modals — done

## Implemented (2026-09-29)
All of the above, verified in preview (desktop 1440 + mobile 390, zero console errors, zero horizontal overflow). Slider drag tested programmatically; form invalid-submit and valid-submit flows tested end to end (demo mode).

## Personas
- Prospective patient (mobile-first): compare results, book consult
- The doctor (owner): edit placeholders, add EmailJS keys, deploy to own domain

## Backlog
- P0: paste real EmailJS keys (user action); replace placeholder name/phone/email/addresses/stats/credentials
- P1: swap SVG case diagrams for real consented patient photography; Google Maps embed for 3 clinics
- P2: blog/oral-health tips; WhatsApp float button; Hindi/Marathi language toggle

## Notes
- No database, no auth — nothing to seed. Preview data note n/a (static files ship with code).
- Dev server caches public/index.html template: restart frontend after editing it.
