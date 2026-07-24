# Media Kit Builder

Media Kit Builder is a SaaS app for Instagram content creators to turn their
social stats, audience demographics, and past brand collaborations into a
polished, shareable media kit — published at `yourapp.com/[username]` and
exportable as a PDF.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Firebase**: Auth (email/password), Firestore (data), Storage (images)
- **Tailwind CSS** for styling
- **Zustand** for editor state management
- **TanStack Query** for data fetching/caching
- **react-pdf** (`@react-pdf/renderer`) for PDF export
- **react-dropzone** for image uploads
- **@hello-pangea/dnd** for drag-and-drop reordering (e.g. past collaborations)

## Project structure

```
app/
  (auth)/login/page.tsx          Login page
  (auth)/register/page.tsx       Sign-up page
  (dashboard)/page.tsx           Signed-in dashboard
  (dashboard)/editor/page.tsx    Media kit editor
  [username]/page.tsx            Public media kit page
  layout.tsx                     Root layout (fonts, providers)
  page.tsx                       Marketing landing page

components/
  ui/                            Reusable primitives (Button, Input, Card...)
  editor/                        Editor-specific components
  mediakit/                      Public media kit display components

lib/
  firebase.ts                    Firebase config & initialization
  firestore.ts                   Firestore helper functions
  storage.ts                     Firebase Storage helpers

store/
  useEditorStore.ts              Zustand store for editor state

types/
  mediakit.ts                    Shared TypeScript interfaces
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

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in the Firebase values in `.env.local`. This file is gitignored and
   should never be committed.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
