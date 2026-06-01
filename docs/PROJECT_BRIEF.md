# Upkeeply — Claude Code First Prompt
# Copy everything below this line and paste it as your first message in Claude Code
# ──────────────────────────────────────────────────────────────────────────────

---

**Project: Upkeeply — Campus Facility Accountability System**
Built for LPU Cavite as a private prototype.

**What it is:**
A QR-based campus facility management system. Workers scan QR codes placed on physical zones (restrooms, corridors, cafeteria, grounds, trash bins, landscape, lighting, etc.) to log their status. Students and the public can anonymously report issues or log found items. Admins (PMU) see everything on a real-time dashboard.

**Three user types:**
- Admin / PMU — full dashboard access, manages workers, zones, QR codes, alerts, lost & found claims, dispatches workers
- Worker / Staff — mobile PWA, logs zone status via QR scan, sees assigned zones, shift to-do list, and history
- Public / Student — anonymous issue reports, found item logging, browsable lost & found board, claim items via LPU school email

**Core features (MVP):**
- QR code per zone — static hash, opens a mobile-optimized form instantly in the browser with no app install required
- Worker check-in flow — zone checklist (items vary by zone type), two states (Cleaned OK / Needs Attention), problem chips for fast issue logging, optional notes, per-submission GPS snap, offline queue that syncs when signal returns
- Zone ownership — each zone has a designated worker; if a different worker covers it they must provide a brief reason visible to admin
- Public issue reports — anonymous by default, session fingerprinted for abuse prevention (not shown publicly), appears on both staff and admin dashboards immediately
- Lost & found — workers or students log found items via QR scan; public board is browsable without login; students claim items by describing it and submitting their LPU school email; admin reviews and sends pre-filled verify or reject email via Resend with one tap; cash and unidentifiable items are logged internally only and never shown on the public board — directed to PMU office in person
- Admin PMU dashboard — live activity log, open alerts with dispatch, lost & found claims management with email preview modal, zone coverage bars, basic analytics (verifications, cleanings, alerts, active workers)

**Design decisions (locked):**
- QR codes are static per zone — no rotation at MVP
- Workers authenticate via individual accounts (email + password via Supabase Auth)
- All logs are chronological, latest on top; no submissions are ever deleted
- GPS is captured once per submission only — not continuous tracking; disclosed in T&C
- Public reports and found item logs use a silent session fingerprint for abuse prevention — not stored publicly, surfaceable by admin only if flagged
- Cash and unidentifiable items (bare keys, unmarked objects) never appear on the public board — PMU in-person only; disclosed in T&C
- Claim verification requires claimant description + LPU school email only — no account needed
- All claim emails are pre-filled templates (verify and reject) that auto-populate with item name, claimant name, found location, pickup info, and reference number; admin can add a short optional note before sending

**Branding:**
Upkeeply's own brand with LPU Cavite accent colors.
- LPU red: #C8102E
- LPU gold: #F5A800
- Brand purple: #7C3AED
- Font: Syne (headings/brand), DM Sans (body), DM Mono (timestamps/codes)
- Supports light and dark mode via a toggle (dark default for workers, light default for public)

**Tech stack:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database + Auth + Realtime: Supabase (PostgreSQL)
- Email: Resend
- Offline sync: Service Worker + IndexedDB
- QR generation: qrcode (npm)
- Hosting: Vercel

---

**Database schema (8 tables):**

```sql
users:
  id uuid PK DEFAULT gen_random_uuid()
  name text NOT NULL
  email text UNIQUE NOT NULL
  role text NOT NULL -- 'admin' | 'worker'
  pin_hash text
  campus_id uuid FK → campuses.id
  created_at timestamp DEFAULT now()

campuses:
  id uuid PK DEFAULT gen_random_uuid()
  name text NOT NULL
  location text
  created_at timestamp DEFAULT now()

zones:
  id uuid PK DEFAULT gen_random_uuid()
  name text NOT NULL
  building text
  zone_type text NOT NULL -- 'restroom' | 'cafeteria' | 'corridor' | 'trash' | 'landscape' | 'other'
  campus_id uuid FK → campuses.id
  designated_worker_id uuid FK → users.id
  qr_hash text UNIQUE NOT NULL
  created_at timestamp DEFAULT now()

logs:
  id uuid PK DEFAULT gen_random_uuid()
  zone_id uuid FK → zones.id NOT NULL
  worker_id uuid FK → users.id
  status text NOT NULL -- 'ok' | 'needs_attention' | 'public_report'
  note text
  coverage_reason text
  is_coverage bool DEFAULT false
  lat float
  lng float
  fingerprint text
  created_at timestamp DEFAULT now()

alerts:
  id uuid PK DEFAULT gen_random_uuid()
  log_id uuid FK → logs.id
  zone_id uuid FK → zones.id NOT NULL
  assigned_to uuid FK → users.id
  severity text NOT NULL -- 'high' | 'med' | 'low'
  description text
  status text DEFAULT 'open' -- 'open' | 'dispatched' | 'resolved'
  resolved_at timestamp
  created_at timestamp DEFAULT now()

found_items:
  id uuid PK DEFAULT gen_random_uuid()
  zone_id uuid FK → zones.id
  logged_by uuid FK → users.id
  item_name text NOT NULL
  category text NOT NULL -- 'bag' | 'electronics' | 'id' | 'wallet' | 'clothing' | 'keys' | 'cash' | 'other'
  description text
  current_location text
  is_public bool DEFAULT true -- false for cash/unidentifiable items
  status text DEFAULT 'unclaimed' -- 'unclaimed' | 'pending' | 'claimed'
  fingerprint text
  created_at timestamp DEFAULT now()

claims:
  id uuid PK DEFAULT gen_random_uuid()
  found_item_id uuid FK → found_items.id NOT NULL
  claimant_name text NOT NULL
  claimant_email text NOT NULL
  description text NOT NULL
  status text DEFAULT 'pending' -- 'pending' | 'verified' | 'rejected'
  admin_note text
  created_at timestamp DEFAULT now()
  resolved_at timestamp

offline_queue:
  id uuid PK DEFAULT gen_random_uuid()
  worker_id uuid FK → users.id
  payload jsonb NOT NULL
  type text NOT NULL -- 'log' | 'found_item'
  synced bool DEFAULT false
  queued_at timestamp DEFAULT now()
  synced_at timestamp
```

**Indexes to create:**
- `logs(zone_id)`, `logs(worker_id)`, `logs(created_at DESC)`, `logs(status)`
- `alerts(zone_id)`, `alerts(status)`, `alerts(assigned_to)`
- `found_items(status)`, `found_items(is_public)`, `found_items(category)`
- `claims(found_item_id)`, `claims(status)`
- `zones(qr_hash)`, `zones(campus_id)`, `zones(designated_worker_id)`
- `offline_queue(worker_id)`, `offline_queue(synced)`

---

**Folder structure:**

```
upkeeply/
├── README.md
├── .env.local                        ← never commit
├── .env.example
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js                ← provided below
├── tsconfig.json
│
├── docs/
│   ├── Upkeeply_Project_Vision.docx
│   └── PROJECT_BRIEF.md              ← save this prompt here
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql    ← all 8 tables
│   │   └── 002_rls_policies.sql      ← row level security
│   └── seed.sql                      ← sample data for dev
│
└── src/
    ├── app/
    │   ├── layout.tsx                ← root layout, font loading
    │   ├── (admin)/
    │   │   ├── layout.tsx            ← admin auth guard
    │   │   ├── dashboard/page.tsx    ← PMU command center
    │   │   ├── zones/page.tsx        ← zone management + QR generation
    │   │   ├── workers/page.tsx      ← worker accounts + zone assignment
    │   │   └── lost-found/page.tsx   ← item management + claims
    │   ├── (worker)/
    │   │   ├── layout.tsx            ← worker auth guard
    │   │   ├── zones/page.tsx        ← my zones to-do list
    │   │   ├── checkin/
    │   │   │   └── [zoneId]/page.tsx ← check-in form per zone
    │   │   └── history/page.tsx      ← shift log history
    │   ├── (public)/
    │   │   ├── report/
    │   │   │   └── [zoneId]/page.tsx ← anonymous issue report
    │   │   ├── found/
    │   │   │   └── [zoneId]/page.tsx ← log a found item
    │   │   └── board/page.tsx        ← public lost & found board
    │   └── api/
    │       ├── logs/route.ts         ← POST submit check-in log
    │       ├── alerts/route.ts       ← GET/PATCH alerts
    │       ├── found-items/route.ts  ← POST log found item
    │       ├── claims/route.ts       ← POST submit claim
    │       └── notify/route.ts       ← POST send email via Resend
    │
    ├── components/
    │   ├── ui/                       ← Button, Badge, Card, Modal, Pill
    │   ├── worker/                   ← ZoneCard, Checklist, ProblemChips, SuccessState
    │   ├── admin/                    ← LogTable, AlertPanel, ClaimItem, EmailModal
    │   └── email/                    ← VerifyEmail.tsx, RejectEmail.tsx (Resend templates)
    │
    ├── lib/
    │   ├── supabase.ts               ← browser + server clients
    │   ├── resend.ts                 ← Resend client
    │   ├── qr.ts                     ← QR hash generation + validation
    │   ├── fingerprint.ts            ← session fingerprint for anonymous logs
    │   └── offline.ts                ← service worker queue helpers
    │
    ├── types/
    │   └── index.ts                  ← TS types matching all 8 DB tables
    │
    └── styles/
        └── globals.css               ← provided below
```

---

**Tailwind config — use this exactly:**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lpu-red':  '#C8102E',
        'gold':     '#F5A800',
        'brand':    '#7C3AED',
        'brand2':   '#9D5CFF',
        'emerald':  '#0D9E6E',
        'sky':      '#0EA5E9',
        'bg':       'var(--color-bg)',
        'surface':  'var(--color-surface)',
        'surface2': 'var(--color-surface2)',
        'surface3': 'var(--color-surface3)',
        'text':     'var(--color-text)',
        'text2':    'var(--color-text2)',
        'text3':    'var(--color-text3)',
        'border':   'var(--color-border)',
        'border2':  'var(--color-border2)',
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        brand: ['Syne', 'sans-serif'],
        mono:  ['DM Mono', 'monospace'],
      },
      borderRadius: {
        xl:    '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
```

---

**globals.css — use this exactly:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

:root, .dark {
  --color-bg:       #07080F;
  --color-surface:  #0E101C;
  --color-surface2: #141726;
  --color-surface3: #1B1E30;
  --color-border:   rgba(255, 255, 255, 0.07);
  --color-border2:  rgba(255, 255, 255, 0.13);
  --color-text:     #EEF0FF;
  --color-text2:    #7E85A8;
  --color-text3:    #4A5070;
}

.light {
  --color-bg:       #F2F3F9;
  --color-surface:  #FFFFFF;
  --color-surface2: #F0F1F8;
  --color-surface3: #E4E6F0;
  --color-border:   rgba(0, 0, 0, 0.08);
  --color-border2:  rgba(0, 0, 0, 0.14);
  --color-text:     #111827;
  --color-text2:    #4B5280;
  --color-text3:    #9298B8;
}

* { box-sizing: border-box; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.2s, color 0.2s;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-surface3); border-radius: 3px; }

:focus-visible { outline: 2px solid #7C3AED; outline-offset: 2px; }

textarea, input {
  background: var(--color-surface2);
  color: var(--color-text);
  border: 1px solid var(--color-border2);
  transition: border-color 0.15s;
}
textarea:focus, input:focus {
  border-color: rgba(124, 58, 237, 0.5);
  outline: none;
}

.accent-bar {
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #C8102E, #F5A800);
}
```

---

**UI components — I have pre-built React + Tailwind components for all three views.**
After the project is initialized, I will provide these files to add:

- `WorkerApp.tsx` → split across `(worker)/zones/page.tsx`, `(worker)/checkin/[zoneId]/page.tsx`, `(worker)/history/page.tsx`
- `PublicApp.tsx` → split across `(public)/report/[zoneId]/page.tsx`, `(public)/found/[zoneId]/page.tsx`, `(public)/board/page.tsx`
- `AdminDashboard.tsx` → `(admin)/dashboard/page.tsx` + extract `EmailModal` into `components/admin/EmailModal.tsx`

Each component contains clearly labelled mock data at the top. When integrating, replace mock data arrays with Supabase query comments — we will wire real data in the next session.

---

**Instructions — do all of the following in order:**

1. Initialize a Next.js 14 project with TypeScript and Tailwind CSS called `upkeeply`

2. Create the full folder structure above — create all files as empty with a single placeholder comment so the structure is visible and navigable

3. Write `tailwind.config.js` using the exact config provided above

4. Write `src/styles/globals.css` using the exact CSS provided above

5. Write `src/app/layout.tsx` with:
   - Google Fonts loaded via `next/font/google` — DM Sans, DM Mono, Syne
   - Font variables applied to the html element
   - Dark mode class defaulting to `dark` on the body
   - Proper metadata: title "Upkeeply", description "LPU Cavite Campus Facility Accountability System"

6. Write `supabase/migrations/001_initial_schema.sql` with all 8 tables from the schema above — include all foreign keys, all indexes listed, UUID defaults via `gen_random_uuid()`, and `created_at` timestamps

7. Write `supabase/migrations/002_rls_policies.sql` with the following rules:
   - Admins: full read and write on all tables
   - Workers: read own user row, read zones where `designated_worker_id = auth.uid()`, insert logs where `worker_id = auth.uid()`, read own logs
   - Public (anon): insert only on `logs` (public reports) and `found_items`, insert only on `claims`, read `found_items` where `is_public = true`

8. Write `supabase/seed.sql` with:
   - 1 campus: LPU Cavite
   - 1 admin user
   - 3 worker users
   - 8 sample zones across different buildings and zone types
   - 5 sample logs
   - 2 sample alerts
   - 2 sample found items (one public, one PMU only)

9. Write `src/lib/supabase.ts` with:
   - A browser client using `createBrowserClient` from `@supabase/ssr`
   - A server client using `createServerClient` from `@supabase/ssr`
   - Both using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

10. Write `src/lib/resend.ts` — initialize Resend client using `RESEND_API_KEY`

11. Write `src/lib/qr.ts` with:
    - `generateQRHash(zoneId: string): string` — returns a deterministic hash from zone ID
    - `generateQRDataURL(hash: string): Promise<string>` — returns a base64 QR image using the `qrcode` npm package
    - `parseQRHash(hash: string): string | null` — validates and returns zone ID from hash

12. Write `src/lib/fingerprint.ts` with:
    - `getFingerprint(): string` — generates a hashed browser fingerprint from navigator.userAgent + screen dimensions + timezone — used for anonymous submission abuse prevention

13. Write `src/types/index.ts` with TypeScript interfaces for all 8 tables matching the schema exactly, plus a `UserRole` type, `LogStatus` type, `AlertSeverity` type, `AlertStatus` type, `ItemCategory` type, `ItemStatus` type, and `ItemVisibility` type

14. Create `.env.example` with these variable names and placeholder values:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    RESEND_API_KEY=your_resend_api_key
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

15. Write `src/app/api/logs/route.ts` — POST endpoint that:
    - Accepts `{ zone_id, status, note, coverage_reason, is_coverage, lat, lng, fingerprint }`
    - Validates required fields
    - Inserts into `logs` table
    - If `status = 'needs_attention'` or `status = 'public_report'`, auto-creates an entry in `alerts`
    - Returns the created log

16. Write `src/app/api/notify/route.ts` — POST endpoint that:
    - Accepts `{ type: 'verify' | 'reject', claim_id, item_name, claimant_name, claimant_email, found_location, ref_id, admin_note? }`
    - Sends the appropriate pre-filled email via Resend
    - Verify email includes: item name, found location, pickup location (PMU Office — Main Building, Ground Floor), office hours (Mon–Fri 8AM–5PM), bring LPU ID, reference number, optional admin note
    - Reject email includes: item name, reference number, direction to visit PMU in person, optional admin note
    - Updates `claims.status` to 'verified' or 'rejected' after sending
    - CC: pmu@lpuc.edu.ph on all emails
    - From: noreply@upkeeply.lpuc.edu.ph

17. Write a basic `src/app/(admin)/layout.tsx` that:
    - Checks for an authenticated Supabase session server-side
    - Redirects to `/login` if not authenticated
    - Redirects to `/` if authenticated but role is not 'admin'

18. Write a basic `src/app/(worker)/layout.tsx` that:
    - Checks for an authenticated Supabase session server-side
    - Redirects to `/login` if not authenticated
    - Redirects to `/` if authenticated but role is not 'worker'

19. Save this entire prompt as `docs/PROJECT_BRIEF.md` — this file will be referenced at the start of every future Claude Code session for context

20. Install required dependencies:
    ```
    next@14 react react-dom typescript @types/react @types/node
    tailwindcss postcss autoprefixer
    @supabase/supabase-js @supabase/ssr
    resend
    qrcode @types/qrcode
    next-pwa
    ```

---

**After completing all 20 steps, confirm:**
- All files are created
- The project runs with `npm run dev` without errors
- List any assumptions made or decisions taken where the instructions were ambiguous

**Do not wire up real Supabase data yet** — that comes in the next session once the structure is confirmed working. Mock data in components is intentional for now.
