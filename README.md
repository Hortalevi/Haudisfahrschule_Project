# Haudis Verkehrsschule — Website Rebuild

A complete rebuild of [haudis-verkehrsschule.ch](https://www.haudis-verkehrsschule.ch) (Baden, AG) — replacing the legacy table-based ASP site with a modern, fast, accessible Next.js frontend backed by a Java (Spring Boot) API and PostgreSQL. Brand colors and the wordmark logo are carried over from the legacy site (`public/images/haudis-logo.png`, palette in `src/app/globals.css`).

It also includes a real admin/instructor portal at `/instructor` — login, a role-gated dashboard (courses, calendar, student sign-ups, revenue), a full website content editor (site info, FAQ, testimonials, gallery, regulations, "Der Weg" steps) for admins, and admin user management — with live updates pushed to every other logged-in dashboard user.

## Architecture

Two separate applications:

- **`/` (this root)** — Next.js 16 frontend. Renders the public site and the instructor/admin dashboard, and proxies browser calls to the backend through `/api/backend/*` (see `next.config.ts`) so the backend's cookies behave as first-party.
- **`/backend`** — Java 21 / Spring Boot 3.5 REST API. Owns all data (PostgreSQL via JPA/Hibernate, versioned with Flyway), authentication (JWT in an httpOnly cookie), authorization (role-based), and the content CMS. See `backend/README` equivalent below for its own details — it's a fully independent service you could point any frontend at.

Why split it this way: the two run as separate deployables, communicating only over HTTP, so the Java side can be tested, scaled, or replaced independently of the frontend.

## Tech stack & why

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js 16 (App Router) | Best-in-class SEO (per-route metadata, JSON-LD, sitemap/robots file conventions), React Server Components keep JS shipped to the browser small. Runs behind a custom `server.ts` (see below) rather than plain `next start`. |
| Frontend language | TypeScript | Type-safe content model (course data, forms) shared between server and client. |
| Backend framework | Spring Boot 3.5 (Java 21) | Mature, well-understood REST/security stack; Spring Data JPA + Flyway give a clear, versioned schema history. |
| Database | PostgreSQL 16 | Real relational database for production use, run locally via `docker-compose.yml`. |
| Backend auth | Spring Security + a custom JWT cookie filter (`backend/.../security/JwtAuthFilter.java`), BCrypt password hashing, cookie-based CSRF (`CookieCsrfTokenRepository`) | Stateless (no server-side session store), same JWT verified independently by the Next.js middleware (`src/lib/jwt.ts`, via `jose`). |
| Styling | Tailwind CSS v4 | CSS-first design tokens (`src/app/globals.css`), no runtime cost, fast to iterate. |
| UI primitives | Radix UI (Accordion, Dialog, Select, Navigation Menu, Radio Group) | Accessible-by-default (keyboard, ARIA, focus management) — hand-styled with Tailwind rather than a heavier component-library dependency. |
| Animation | Framer Motion + a few CSS keyframes | Scroll reveals and micro-interactions via Framer Motion; the **hero's** above-the-fold entrance uses a plain CSS animation instead, so LCP isn't gated on JS hydration. All motion respects `prefers-reduced-motion`. |
| Forms | react-hook-form + Zod (frontend), Jakarta Bean Validation (backend) | Shared-shape validation on both sides of the API boundary. |
| Realtime | Custom `server.ts` (Next's custom-server pattern) + `ws`, fed by a webhook from the Java backend (`RealtimeNotifier.java` → `POST /api/internal/realtime`) | The frontend still owns the WebSocket relay to connected dashboards; the backend just tells it "something changed" over a shared-secret-authenticated HTTP call. |
| Icons | lucide-react | Tree-shakeable, consistent stroke-based icon set. |
| Fonts | Inter (body) + Manrope (display), via `next/font` | Self-hosted (no external request), full Latin-Extended coverage for German umlauts/ß. |

## Folder structure

```
server.ts                  Custom Node server: wraps Next's request handler, the `ws` realtime relay,
                            and the /api/internal/realtime ingest endpoint the Java backend calls
proxy.ts (src/proxy.ts)    Next 16's renamed Middleware — verifies the JWT cookie for /instructor/*
next.config.ts             Proxies /api/backend/* to the Java backend (JAVA_API_URL)
backend/                   Spring Boot API - see its section below
src/
  app/                     Routes (App Router). One folder per URL.
    kursangebot/[slug]/    Dynamic route — one page per course, read live from the backend
    api/contact/           Mock contact endpoint (not yet wired to persistence/email)
    instructor/
      login/                            Public login page (client-side call to the backend, see below)
      dashboard/                       Protected dashboard (any admin or instructor)
        angebote/                      Course offers: list + create/edit form + row actions
        kalender/                      Month-view calendar of course dates
        anmeldungen/                   Student roster per course date, grouped in an accordion
        umsatz/                        Revenue/cost/profit breakdown per course
        website/                       Admin-only: site content CMS (see below)
        benutzer/                      Admin-only: user management (see below)
    sitemap.ts, robots.ts, opengraph-image.tsx   SEO file conventions - fetch live site settings
  components/
    ui/                    Design-system primitives (Button, Card, Accordion, Select, ...)
    layout/                Navbar, Footer (fetch/receive live site settings)
    sections/              Page sections (Hero, RegistrationFlow, Gallery, ...)
  content/                 What's left static: primary nav structure, footer course links, service
                            areas, and shared TS types - everything else is DB-backed, see src/lib
  lib/                     api.ts (backend API client), jwt.ts (cookie verification), site-settings.ts/
                            faq.ts/testimonials.ts/gallery.ts/regulations.ts/process-steps.ts (public
                            content loaders), courses.ts/course-dates.ts/stats.ts/users.ts/
                            registrations.ts (dashboard data access), schemas.ts (Zod)
public/images/gallery/     Real photos carried over from the legacy site
public/images/haudis-logo.png   Legacy wordmark logo, carried over as-is
```

## Content parity with the legacy site

Every page/feature from the original ASP site has a modern equivalent:

| Legacy page | New route |
|---|---|
| Home | `/` |
| Weg | `/der-weg` |
| Kurs-Angebot (incl. Bögle) | `/kursangebot` + `/kursangebot/[slug]` (9 courses: Fahrstunden Auto/Motorrad, Motorradgrundkurs, VKU, BTU, Nothelferkurs, Bögle, Lastwagen, Taxi) |
| Kursdaten & Anmeldung | `/kursdaten-anmeldung` (filterable date list + booking form) |
| Vorschriften Auto | `/vorschriften/auto` |
| Vorschriften Motorrad | `/vorschriften/motorrad` |
| Bilder | `/galerie` (real legacy photos, with filter + lightbox) |
| Kontakt | `/kontakt` |
| Login/Admin | `/instructor/login` + `/instructor/dashboard` — see "Admin/instructor portal" below |
| — | `/impressum`, `/datenschutz` (new — legally required for a Swiss business) |

Legacy ASP URLs (`/default.asp?nav=...`) 301-redirect to their new equivalents in `next.config.ts`, preserving any inbound links/SEO equity.

## Admin/instructor portal (`/instructor`)

A role-gated dashboard, backed entirely by the Java API:

- **Roles**: each account is independently `isAdmin` and/or `isInstructor` (a person can be both). Both roles see Übersicht/Angebote/Kalender/Anmeldungen/Umsatz; **only admins** additionally see **Website** (content CMS) and **Benutzer** (user management) in the sidebar. The backend enforces this independently of the UI — hiding a nav link is a UX nicety, not the security boundary.
- **`/instructor/login`** — email/password login. This one screen talks to the backend directly through the `/api/backend/*` rewrite (not a Server Action) so the browser receives the backend's Set-Cookie headers directly; every other authenticated action in the dashboard is a Server Action that forwards the already-set session/CSRF cookies server-to-server (see `src/lib/api.ts`).
- **Self-service registration is gone.** Only an existing admin can create a new admin or instructor account, from **Benutzer**. This closes the old shared-invite-code weak point and matches "not everyone can create an admin/instructor account."
- **`/instructor/dashboard/benutzer`** (admin-only) — list every account, toggle each person's Admin/Fahrlehrer roles, create new accounts, delete accounts. The backend refuses to delete or demote the last remaining admin, so the site can never end up with zero admins.
- Any logged-in user (admin or instructor) can delete their own account from the dashboard sidebar ("Konto löschen"), subject to the same last-admin guard.
- **`/instructor/dashboard/website`** (admin-only) — full content CMS: site settings (contact info, address, opening hours, social links), FAQ, testimonials, gallery images, Auto/Motorrad regulations, and "Der Weg" steps. Everything here is a normal CRUD screen (add/edit/delete) backed by the same Java content endpoints the public site reads from — no code change or redeploy needed to update any of it.
- **`/instructor/dashboard/angebote`** — create/edit/deactivate/delete course offers (slug is immutable after creation, since it's the public URL).
- **`/instructor/dashboard/kalender`** — month-view calendar of course dates, with create/edit/delete and an optional instructor assignment.
- **`/instructor/dashboard/anmeldungen`** — every student sign-up, grouped by course date, with seat counts and a cancel action.
- **`/instructor/dashboard/umsatz`** — revenue, cost, and profit, both totals and broken down per course.
- **Live updates**: every mutation on the backend calls a webhook (`RealtimeNotifier.java`) into the frontend's `server.ts`, which re-broadcasts over the existing WebSocket relay (`/api/ws/dashboard`) to every connected dashboard, triggering a `router.refresh()` — so if one person edits a course or a student registers, everyone else's dashboard updates without a manual reload.

### Mock accounts (change before going live)

Seeded by the backend's Flyway migration (`backend/.../db/migration/V2__seed_users.sql`):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@haudis.ch` | `ChangeMe-Admin1!` |
| Instructor | `instructor@haudis.ch` | `ChangeMe-Instructor1!` |

### Handing off to the client (future step)

The plan is: once the site is live, the client logs in with the seeded admin account, creates their own real admin account from **Benutzer**, and then the seeded/coder accounts are deleted (also from **Benutzer** — no code change needed, the UI already supports all of this). At that point rotate `JWT_SECRET` on both the frontend and backend to invalidate any old sessions.

## Backend (`/backend`)

Spring Boot 3.5 / Java 21, Maven. Key pieces:

- **`db/migration/`** — Flyway SQL migrations: `V1` creates the schema, `V2` seeds the two mock accounts above, `V3` seeds the current site content (courses, dates, FAQ, testimonials, gallery, regulations, process steps, site settings) so the live site is unaffected on first run.
- **`security/`** — `JwtService` (signs/verifies the cookie), `JwtAuthFilter` (reads it per-request), `LoginRateLimiter` (in-memory sliding window on `/auth/login`), `SessionCookieFactory`.
- **`config/SecurityConfig.java`** — the actual authorization rules: public `GET /api/public/**`, admin-only `/api/users/**` and `/api/content/**`, admin-or-instructor `/api/courses/**`/`/api/course-dates/**`/`/api/registrations/**`/`/api/stats/**`, everything else requires authentication.
- **`service/` / `web/`** — one service + controller pair per resource (courses, course dates, registrations, stats, users, and each content type).
- **`exception/GlobalExceptionHandler.java`** — every error response is a sanitized `{"message": "..."}` JSON body; nothing ever leaks a stack trace to the client.

### Security measures already in place

- Passwords hashed with BCrypt (strength 12); login returns an identical error for "unknown email" vs. "wrong password" (no user enumeration).
- Stateless JWT in an httpOnly, `SameSite=Lax` cookie (`Secure` when `COOKIE_SECURE=true`, which must be set once served over HTTPS).
- CSRF protection (cookie + header double-submit) on every mutating request, including ones a browser sends to the public registration endpoint.
- Rate limiting on login (per IP+email) to slow down brute force.
- Role-based `@PreAuthorize`-equivalent checks (`SecurityConfig`) with a default-deny fallback (`anyRequest().authenticated()`).
- CORS locked to the configured frontend origin only (`FRONTEND_ORIGIN`), not `*`.
- Bean Validation on every request DTO; a global handler ensures validation/auth/unexpected errors all return safe, generic messages.
- Last-admin guard: the API refuses any action that would leave zero admin accounts.

None of this replaces a real pre-launch security review — see "Before going live" below.

## Environment variables

Two separate `.env` files (both git-ignored):

**Root (`.env`, see `.env.example`)** — used by the Next.js app:

| Variable | Purpose |
|---|---|
| `JAVA_API_URL` | Base URL of the backend, e.g. `http://localhost:8080`. Also used by `next.config.ts`'s rewrite. |
| `JWT_SECRET` | Verifies the session cookie. **Must exactly match** the backend's `JWT_SECRET`. Generate with `openssl rand -base64 32`. |
| `INTERNAL_REALTIME_SECRET` | Shared secret the backend must send when calling this app's `/api/internal/realtime` webhook. **Must exactly match** the backend's value. |

**`backend/.env`** (see `backend/.env.example`) — used by the Spring Boot app:

| Variable | Purpose |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection (matches `docker-compose.yml` defaults). |
| `JWT_SECRET` | Must exactly match the frontend's value. |
| `FRONTEND_ORIGIN` | Allowed CORS origin, e.g. `http://localhost:3000`. |
| `NEXT_INTERNAL_URL`, `INTERNAL_REALTIME_SECRET` | Where the frontend runs, and the shared secret for the realtime webhook (must match the frontend's value). |
| `COOKIE_SECURE` | `false` for local http dev; set `true` once served over https. |

## Running locally

Requires Docker (for Postgres), Node (version pinned in `.tool-versions`), and Java 21 + Maven for the backend.

```bash
# 1. Database
docker compose up -d postgres

# 2. Backend (from backend/)
cd backend
cp .env.example .env               # then fill in real secrets, see above
export $(grep -v '^#' .env | xargs) && ./mvnw spring-boot:run
# runs on http://localhost:8080, applying Flyway migrations (schema + seed data) on startup

# 3. Frontend (from the repo root, in another terminal)
cp .env.example .env               # then fill in real secrets - JWT_SECRET/INTERNAL_REALTIME_SECRET
                                    # must match what you put in backend/.env
npm install
npm run dev                        # http://localhost:3000 (custom server + WebSocket relay)
npm run build && npm run start     # production build
```

`npm run dev` / `npm run start` run `server.ts` (not plain `next dev`/`next start`) so the realtime WebSocket relay and the internal realtime-ingest endpoint are attached to the same HTTP server as the site.

## Before going live

- Change or delete the seeded mock accounts (see "Handing off to the client" above) and rotate `JWT_SECRET`.
- Generate fresh, real secrets for `JWT_SECRET` and `INTERNAL_REALTIME_SECRET` in production — don't reuse the local-dev values committed as examples.
- Set `COOKIE_SECURE=true` on the backend once served over HTTPS, and put both services behind TLS.
- Update `FRONTEND_ORIGIN` / `JAVA_API_URL` to the real production hostnames.
- Have a professional review the placeholder legal pages (`/impressum`, `/datenschutz`) before launch.
- Replace the placeholder testimonials with real ones (e.g. exported from Google Business Profile).
- Consider a real pre-launch security review/pen test given this handles student PII and will be public.

## Assets

- **Real photos** from the legacy site (`public/images/gallery/`) are used on the `/galerie` page and in a couple of "about/why us" spots — they're dated and low-resolution by 2026 standards, so they're used at thumbnail/gallery scale rather than stretched into large hero banners.
- **Recommendation**: commission a short professional photo/video session (Verkehrszentrum interior, fleet, Bruno & Ausilia teaching), then add the new images from the **Galerie** admin screen once available.

## Performance & accessibility

Audited with Lighthouse (production build, localhost, mobile simulation) across every page template:

- **Accessibility: 100**, **Best Practices: 100**, **SEO: 100** on every page.
- **Performance: 87–93** depending on page. The remaining gap to 95+ is dominated by Lighthouse's simulated mobile network/CPU throttling on a local dev machine — deploying behind a real CDN/network should close most of the rest.

Two real bugs were caught and fixed during this audit (not just simulated-throttling artifacts):
- A stat-counter animation that silently stayed at "0" on mobile (an IntersectionObserver margin was shrinking the viewport horizontally as well as vertically, so a left-aligned element never registered as "in view").
- Insufficient color contrast on the primary CTA button (`white on ember-500` ≈ 2.6:1) — the CTA/accent color was darkened for solid-background + white-text use (`ember-700`/`ember-800`) while keeping the brighter tone for large decorative use (gradients, low-opacity tints).

## Design system reference

Colors, type scale, and spacing are defined once in `src/app/globals.css` (`@theme` block) — see that file for the full token list (navy/sand/ember/moss palette, radii, shadows). The palette matches the legacy site's actual wordmark (black, `#EF3C61` pink-red, `#FFF829` yellow) rather than the legacy CSS file's generic grey/orange, which was never used consistently; `moss` (green) is kept as-is since it's a UX success/available-seats signal unrelated to brand color.
