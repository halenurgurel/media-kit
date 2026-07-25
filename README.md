# Media Kit Builder

Media Kit Builder is a SaaS app for Instagram content creators to turn their
social stats, audience demographics, and past brand collaborations into a
polished, shareable media kit — published at `yourapp.com/[username]` and
exportable as a PDF.

## Features

- **Email/password auth** with Firebase Authentication
- **Drag-and-drop editor** for profile info, stats, platforms, services,
  collaborations, and theme customization
- **Instagram Business Login** — connect an account to pull live stats and
  audience demographics, with token refresh/disconnect support
- **AI-generated bios** via Google Gemini
- **Image uploads** via Cloudinary (unsigned upload presets)
- **PDF export** of the finished media kit (`@react-pdf/renderer`)
- **Public media kit page** at `/[username]` for sharing with brands

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Firebase**: Auth (email/password), Firestore (data), Storage
- **Firebase Admin SDK** for server-side token verification and AI usage
  tracking (in API routes)
- **Cloudinary** for image uploads
- **Google Gemini API** for AI bio generation
- **Instagram Graph API** (Business Login) for account connection & insights
- **Tailwind CSS** for styling
- **Zustand** for client state (auth, editor, toasts)
- **TanStack Query** for data fetching/caching
- **react-pdf** (`@react-pdf/renderer`) for PDF export
- **react-dropzone** for image uploads
- **@hello-pangea/dnd** for drag-and-drop reordering

## Project structure

```
app/
  (auth)/login/page.tsx                    Login page
  (auth)/register/page.tsx                 Sign-up page
  (dashboard)/dashboard/page.tsx            Signed-in dashboard
  (dashboard)/editor/page.tsx               Media kit editor
  [username]/page.tsx                       Public media kit page
  [username]/not-found.tsx                  404 for unknown usernames
  api/auth/instagram/route.ts               Start Instagram OAuth flow
  api/auth/instagram/callback/route.ts      Instagram OAuth callback
  api/instagram/disconnect/route.ts         Disconnect Instagram account
  api/instagram/refresh/route.ts            Refresh Instagram access token
  api/generate-bio/route.ts                 AI bio generation endpoint (Gemini)
  layout.tsx                                Root layout (fonts, providers)
  page.tsx                                  Marketing landing page

components/
  ui/                                       Reusable primitives (Button, Input, Card...)
  auth/AuthProvider.tsx                     Firebase auth context provider
  editor/                                   Editor components (sidebar, sections, uploader...)
  mediakit/                                 Public media kit display components

lib/
  firebase.ts                               Firebase client config & initialization
  firebaseAdmin.ts                          Firebase Admin SDK setup (server-only)
  auth.ts                                   Auth helper functions
  firestore.ts                              Firestore helper functions
  storage.ts                                Firebase Storage helpers
  cloudinary.ts                             Cloudinary upload helpers
  gemini.ts                                 Gemini API client for bio generation
  instagram.ts                              Instagram Graph API helpers
  demographics.ts                           Audience demographics helpers
  mediakit.ts                               Media kit data helpers
  aiUsage.ts                                AI usage tracking (rate limiting)
  generateMediaKitPDF.tsx                   PDF document generation
  theme.ts / fonts.ts / objectPath.ts / utils.ts   Shared utilities
  actions/mediakit.actions.ts                Server actions for media kit data
  queries/auth.queries.ts, mediakit.queries.ts   TanStack Query hooks

store/
  useAuthStore.ts                           Zustand store for auth state
  useEditorStore.ts                         Zustand store for editor state
  useToastStore.ts                          Zustand store for toast notifications

hooks/
  useDebouncedValue.ts                      Debounce hook

types/
  mediakit.ts                               Shared TypeScript interfaces

firestore.rules                              Firestore security rules
middleware.ts                                Route protection middleware
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Firebase project**

   - Go to the [Firebase console](https://console.firebase.google.com) and
     create a project.
   - Enable **Authentication** (Email/Password provider).
   - Enable **Firestore Database**.
   - Enable **Storage**.
   - Register a web app and copy the config values.
   - Generate a service account key for the Admin SDK: Project settings >
     Service accounts > Generate new private key.

3. **Create a Cloudinary account**

   - Go to the [Cloudinary console](https://cloudinary.com/console) and
     create an **unsigned upload preset** under Settings > Upload.

4. **Get a Gemini API key**

   - Create a free-tier key at
     [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

5. **Create a Facebook/Instagram app**

   - Create an app at [developers.facebook.com/apps](https://developers.facebook.com/apps)
     and configure Instagram Business Login.
   - Set the redirect URI to match your local/deployed callback URL.

6. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in the Firebase, Cloudinary, Gemini, and Instagram values in
   `.env.local`. This file is gitignored and should never be committed.

7. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
