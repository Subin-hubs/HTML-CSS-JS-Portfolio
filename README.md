# Subin Tamang — Portfolio (HTML / CSS / JS)

A small personal portfolio site built with plain HTML, CSS and a bit of JavaScript. This README documents the project structure and the purpose of each file and folder so you can quickly understand, run, or modify the site.

## Quick start

- Open `index.html` in a browser (double-click or serve with a static server).
- No build step or dependencies required.

## Project overview

- **Purpose:** Personal portfolio showcasing projects, skills, education and contact form.
- **Tech:** HTML, CSS, vanilla JavaScript, EmailJS for contact form integration.

## Repository structure

- `index.html` — Main single-page website. Contains site markup, inline project/cert data and all JavaScript used for UI (modals, contact form, project modal data, small utilities).
- `style.css` — Full styling for the site (variables, layout, responsive rules, components, animations).
- `README.md` — This file.
- `assets/` — Static images used by the site.

### assets/

- `logo.png` — Site favicon and brand logo referenced in the page head.
- `subin.png` — Author/portrait image used in the About section.
- `project/` — Folder containing certificate images used in the Certifications section:
  - `Br.jpeg` — Flutter certificate image (Broadway Infosys).
  - `microsoft.png` — Azure / Microsoft certificate image.
  - `python.png` — HackerRank Python certificate image.
- `projects/` — Images used for featured project cards and project modal thumbnails:
  - `aadanpradan.jpg` — Aadan Pradan project photo.
  - `aadanpradanlogo.png` — Aadan Pradan logo.
  - `betyzylogo.jpeg` — Betzy logo.
  - `betzy.jpg` — Betzy project photo.
  - `facebook.jpg` — Facebook Clone project thumbnail.
  - `portfolio.jpeg` — Portfolio website thumbnail (used to link to live demo).
  - `sochmoney.png` and `sochmoney1.png` — SochMoney app thumbnails.
  - `betzy.jpg`, `betzylogo.jpeg` and other images are referenced by project cards and modal data inside `index.html`.

## Key implementation notes

- The page is a single HTML file that also contains the JavaScript project and certification data objects (search for `const projects = { ... }` and `const certs = { ... }` in `index.html`).
- Contact form uses EmailJS (the page initializes EmailJS and calls `emailjs.send(...)` inside `submitForm()`).
- Modal UI is implemented with a lightweight overlay pattern (functions: `openProjectModal()`, `openCertModal()`, `showModal()`, `closeModal()`).
- Styling is scoped in `style.css` with CSS custom properties for easy theming.

## How to edit

- To add or change a project: update the `projects` object inside `index.html` and add/replace the thumbnail image in `assets/projects/`.
- To add a certificate: update the `certs` object inside `index.html` and add the image to `assets/project/`.
- To update contact email or EmailJS service/template IDs: edit the `emailjs.init(...)` call and `emailjs.send(...)` parameters in `index.html`.

## Notes & recommendations

- Consider extracting JavaScript into a separate file (e.g., `main.js`) for maintainability if the project grows.
- If you plan to deploy, serve files from a static host (Vercel, Netlify, GitHub Pages) for reliable CDN and HTTPS.
- Remove or rotate any API keys or service IDs before publishing publicly if they are private.

---

If you want, I can also:
- move inline scripts into `main.js` and split CSS into components,
- add a minimal `package.json` + dev server (`http-server`), or
- create deployment instructions for GitHub Pages or Vercel.

## Modern redesign (scaffold)

I added a production-ready scaffold under `modern/` that implements the requested premium redesign and architecture. Files added:

- `modern/index.html` — new modern single-page entry (modular, semantic, accessible).
- `modern/styles/` — `base.css`, `components.css`, `theme.css` (dark + light variants, glassmorphism, bento grid).
- `modern/scripts/` — `main.js`, `projects.js`, `utils.js` (modular JS, theme toggle, animations, contact integration).
- `api/send-email.js` — example Vercel-style serverless function for secure contact handling (uses SMTP via env vars, optional reCAPTCHA verification and basic rate limiting). Do NOT commit secrets.

How to try the modern version locally:

1. Serve the `modern/` folder from a static server. Example using `http-server` (install globally):

```bash
npm install -g http-server
cd modern
http-server -c-1
```

2. For the contact form to work, deploy the `api/send-email.js` as a serverless function (Vercel or Netlify). Set these environment variables in your hosting provider:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (SMTP relay credentials)
- `CONTACT_RECEIVER` (optional, email that receives messages)
- `RECAPTCHA_SECRET` (optional, recommended for spam protection)

Security notes:

- Do not store secrets in the front-end. Use provider env variables.
- Replace the in-memory rate limiter in `api/send-email.js` with a persistent store (Redis, Cloudflare KV) for robust rate limiting in production.
- Add strict CSP, HSTS and other security headers at the hosting edge or web server.

Next steps I can do for you:

- Polish the visual design and add high-fidelity animated transitions (GSAP timelines).
- Integrate GitHub stats and contribution graph (server-side call or client caching with rate limits).
- Add Lighthouse tuning (image optimization, preloading, critical CSS).
