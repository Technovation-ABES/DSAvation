# Project Reorganisation Plan

This plan outlines the structural refactoring of the DSAvation project to align strictly with `PROJECT_STRUCTURE_GUIDE.md`.

---

## 1. Current Organisational Problems

1. **Monolithic `src/main.jsx` (4,337 lines):**
   - Combines Vite entry logic, root ReactDOM rendering, PWA registration, global error trapping, and React Error Boundary.
   - Holds the entire root application component (`App`) with dozens of state variables, effects, and handlers.
   - Inlines 7 full-page views: Home/Curriculum, Account/Progress, Activity, Members Directory, Admin Dashboard, Club Challenge, and Reset Password.
   - Inlines 6 major modal dialogs (Auth, Forgot Password, Explainer Card, Repick Explainer, Export CSV, WhatsApp Broadcast) and 2 overlay dialogs (Member Admin, Heatmap Day).
   - Inlines shared layout components (Desktop Navigation Header, Mobile Navigation Bar, Toast Notice).
   - Inlines curriculum and directory sub-components (`QuestionRow`, `QuestionActionsGuide`, `HeroTitleTypewriter`, `MemberDirectoryCard`, `AdminSubmissionsHeatmap`).
   - Inlines utility functions (API fetch client, route mapping, date formatting, message template management, question normalization, theme initialization).

2. **Scattered Root-Level Source Files:**
   - `src/avatar.js`, `src/explainerCard.js`, and `src/liquidGlass.js` are loose in `src/` instead of `src/utils/`.
   - `src/utils/useAdaptiveCardTheme.js` is a React hook located in `src/utils/` instead of `src/hooks/`.

3. **Absence of Standard Layer Folders in `src/`:**
   - Missing `src/App.jsx`.
   - Missing `src/api/` for HTTP communication.
   - Missing `src/data/` for application constants.
   - Missing `src/hooks/` for custom React hooks.
   - Missing `src/routes/` for route resolution and navigation helpers.
   - Missing `src/pages/` for page-level components.
   - Missing `src/components/common/`, `src/components/layout/`, and feature-specific component groupings.

---

## 2. Target Project Structure (Aligned with `PROJECT_STRUCTURE_GUIDE.md`)

```text
DSAvation/
├── api/
│   └── handler.js                     # Serverless API gateway handler (Vercel)
├── docs/                              # Project documentation and screenshots
├── public/                            # Static public assets (manifest, sw.js, icons, logos)
├── server/                            # Server implementation
│   ├── data/
│   │   └── questions.json             # 220 DSA questions curriculum database
│   ├── api.js                         # Core HTTP API handler & business operations
│   ├── db.js                          # MongoDB database connection helper
│   └── email.js                       # Nodemailer SMTP communication helper
├── src/
│   ├── api/
│   │   └── client.js                  # Frontend fetch client & error handling (api())
│   ├── components/
│   │   ├── atmosphere/                # Visual atmosphere shaders & canvas effects
│   │   │   ├── AtmosphereBackdrop.jsx
│   │   │   ├── SnowEffect.jsx
│   │   │   └── atmosphere.css
│   │   ├── common/                    # Shared reusable primitives
│   │   │   ├── ErrorBoundary.jsx      # Error boundary fallback wrapper
│   │   │   ├── Icon.jsx               # SVG icon renderer with embedded icon dictionary
│   │   │   ├── MemberAvatar.jsx       # DiceBear & custom avatar renderer
│   │   │   ├── Pill.jsx               # Tag / badge pill component
│   │   │   └── ProgressHeatmap.jsx    # GitHub-style contribution heatmap
│   │   ├── dashboard/                 # Admin dashboard sub-components
│   │   │   ├── AdminSubmissionsHeatmap.jsx
│   │   │   └── HeatmapDayModal.jsx
│   │   ├── home/                      # Home / Curriculum sub-components
│   │   │   ├── HeroTitleTypewriter.jsx
│   │   │   ├── QuestionActionsGuide.jsx
│   │   │   └── QuestionRow.jsx
│   │   ├── layout/                    # Page chrome & persistent layout elements
│   │   │   ├── MobileNav.jsx          # Mobile bottom navigation bar
│   │   │   ├── Navbar.jsx             # Top desktop navigation header
│   │   │   └── NoticeBanner.jsx       # Toast feedback banner
│   │   ├── members/                   # Members directory sub-components
│   │   │   ├── MemberAdminOverlay.jsx # Admin management overlay for directory members
│   │   │   └── MemberDirectoryCard.jsx
│   │   └── modals/                    # Standalone modal dialogs
│   │       ├── AuthModal.jsx          # Sign-in / Sign-up dialog
│   │       ├── ExplainerModal.jsx     # Solution explainer card presentation dialog
│   │       ├── ExportCsvModal.jsx     # Submissions CSV export filter dialog
│   │       ├── ForgotPasswordModal.jsx# Forgot password recovery email dialog
│   │       ├── MessageBroadcastModal.jsx # WhatsApp announcement generator & editor
│   │       └── RepickModal.jsx        # Admin solution explainer repick dialog
│   ├── data/
│   │   └── constants.js               # CLUB_DEPARTMENTS, message templates, pagination
│   ├── hooks/
│   │   └── useAdaptiveCardTheme.js    # Adaptive card theme hook
│   ├── pages/                         # Screen-level route views
│   │   ├── AccountPage.jsx            # Account & profile customizer (view === 'progress')
│   │   ├── ActivityPage.jsx           # Personal streak & activity logs (view === 'activity')
│   │   ├── ClubChallengePage.jsx      # Daily Question of the Day & leaderboard (view === 'club')
│   │   ├── DashboardPage.jsx          # Admin overview & management (view === 'dashboard')
│   │   ├── HomePage.jsx               # 220 DSA questions tracker (view === 'general')
│   │   ├── MembersPage.jsx            # Public club directory (view === 'members')
│   │   └── ResetPasswordPage.jsx      # Password reset token form (view === 'reset-password')
│   ├── routes/
│   │   └── routes.js                  # getViewFromPath, getPathFromView
│   ├── utils/
│   │   ├── adaptiveCardTheme.js       # WCAG & luminance theme calculation utility
│   │   ├── avatar.js                  # DiceBear avatar seeds & data URI generators
│   │   ├── dateUtils.js               # localDay, formatDmy, shiftDay, studyYearLabel
│   │   ├── explainerCard.js           # html2canvas card image exporter
│   │   ├── liquidGlass.js             # Canvas liquid glass interactive shader
│   │   ├── messageTemplates.js        # Message template storage & interpolation
│   │   ├── normalizeQuestions.js      # Curriculum question data normalizer
│   │   └── theme.js                   # Theme detection and storage helpers
│   ├── App.jsx                        # Root React component managing application state & routing
│   ├── forest.css                     # Forest theme styles
│   ├── main.jsx                       # Vite application entry point
│   └── style.css                      # Primary application styles
├── test/
│   ├── adaptiveCardTheme.test.js      # Adaptive card theme unit tests
│   └── api.test.js                    # API and security test suite
├── index.html                         # HTML template
├── package.json                       # Project manifest
├── PROJECT_STRUCTURE_GUIDE.md         # Reference architectural guide
├── REFACTOR_PLAN.md                   # This document
├── vercel.json                        # Deployment configuration
└── vite.config.js                     # Vite build configuration
```

---

## 3. Mapping of Existing Files and Responsibilities

| Existing Code / Location | Proposed Location | Responsibility |
|---|---|---|
| `src/main.jsx` (Vite bootstrap, service worker, createRoot, window error listeners) | `src/main.jsx` | Minimal, clean entry point |
| `src/main.jsx` (App component, state orchestration) | `src/App.jsx` | Root state orchestration and view routing |
| `src/main.jsx` (`api()`) | `src/api/client.js` | Centralized fetch API client |
| `src/main.jsx` (`CLUB_DEPARTMENTS`, template constants) | `src/data/constants.js` | Global static configuration data |
| `src/main.jsx` (`getViewFromPath`, `getPathFromView`) | `src/routes/routes.js` | Routing mapping functions |
| `src/main.jsx` (`localDay`, `formatDmy`, `shiftDay`, `studyYearLabel`) | `src/utils/dateUtils.js` | Date & study year utilities |
| `src/main.jsx` (`getMessageTemplate`, `saveMessageTemplate`, `resetMessageTemplate`, `renderMessageText`) | `src/utils/messageTemplates.js` | WhatsApp message template utilities |
| `src/main.jsx` (`normalizeQuestions`) | `src/utils/normalizeQuestions.js` | Question curriculum data normalizer |
| `src/main.jsx` (`initialTheme`, `rememberDarkStyle`, `storedDarkStyle`) | `src/utils/theme.js` | Theme initialization and persistence |
| `src/avatar.js` | `src/utils/avatar.js` | DiceBear avatar generation |
| `src/explainerCard.js` | `src/utils/explainerCard.js` | Explainer card canvas image generation |
| `src/liquidGlass.js` | `src/utils/liquidGlass.js` | Liquid glass shader interaction |
| `src/utils/useAdaptiveCardTheme.js` | `src/hooks/useAdaptiveCardTheme.js` | Custom React hook for adaptive card themes |
| `src/utils/adaptiveCardTheme.js` | `src/utils/adaptiveCardTheme.js` | Preserved in place for test compatibility |
| `src/main.jsx` (`Icon`, `Pill`, `MemberAvatar`, `ProgressHeatmap`, `ErrorBoundary`) | `src/components/common/` | Shared UI components |
| `src/main.jsx` (Desktop Header, Mobile Nav, Toast Notice) | `src/components/layout/` | Application chrome components |
| `src/main.jsx` (`QuestionRow`, `QuestionActionsGuide`, `HeroTitleTypewriter`) | `src/components/home/` | Home / Curriculum components |
| `src/main.jsx` (`MemberDirectoryCard`, `MemberAdminOverlay`) | `src/components/members/` | Members directory components |
| `src/main.jsx` (`AdminSubmissionsHeatmap`, `HeatmapDayModal`) | `src/components/dashboard/` | Admin dashboard components |
| `src/main.jsx` (Auth, ForgotPassword, Explainer, Repick, Export, Message modals) | `src/components/modals/` | Standalone modal dialogs |
| `src/main.jsx` (Home view: `view === 'general'`) | `src/pages/HomePage.jsx` | 220 DSA questions curriculum page |
| `src/main.jsx` (Account view: `view === 'progress'`) | `src/pages/AccountPage.jsx` | Member profile & settings page |
| `src/main.jsx` (Activity view: `view === 'activity'`) | `src/pages/ActivityPage.jsx` | Personal activity & heatmap page |
| `src/main.jsx` (Members view: `view === 'members'`) | `src/pages/MembersPage.jsx` | Club members directory page |
| `src/main.jsx` (Dashboard view: `view === 'dashboard'`) | `src/pages/DashboardPage.jsx` | Admin management dashboard page |
| `src/main.jsx` (Club view: `view === 'club'`) | `src/pages/ClubChallengePage.jsx` | Daily Club challenge page |
| `src/main.jsx` (Reset Password view: `view === 'reset-password'`) | `src/pages/ResetPasswordPage.jsx` | Password reset link landing page |

---

## 4. Execution Steps

1. **Create Utility and Data Modules:**
   - Extract `dateUtils.js`, `messageTemplates.js`, `normalizeQuestions.js`, `theme.js` into `src/utils/`.
   - Move `avatar.js`, `explainerCard.js`, `liquidGlass.js` into `src/utils/` (with compatibility re-exports).
   - Extract `constants.js` into `src/data/`.
   - Extract `client.js` into `src/api/`.
   - Extract `routes.js` into `src/routes/`.
   - Move `useAdaptiveCardTheme.js` into `src/hooks/` (with compatibility re-export in `src/utils/`).

2. **Extract Common and Layout Components:**
   - Create `src/components/common/Icon.jsx`, `Pill.jsx`, `MemberAvatar.jsx`, `ProgressHeatmap.jsx`, `ErrorBoundary.jsx`.
   - Create `src/components/layout/Navbar.jsx`, `MobileNav.jsx`, `NoticeBanner.jsx`.

3. **Extract Modals and Feature Sub-components:**
   - Create `src/components/modals/AuthModal.jsx`, `ForgotPasswordModal.jsx`, `ExplainerModal.jsx`, `RepickModal.jsx`, `ExportCsvModal.jsx`, `MessageBroadcastModal.jsx`.
   - Create `src/components/home/QuestionRow.jsx`, `QuestionActionsGuide.jsx`, `HeroTitleTypewriter.jsx`.
   - Create `src/components/members/MemberDirectoryCard.jsx`, `MemberAdminOverlay.jsx`.
   - Create `src/components/dashboard/AdminSubmissionsHeatmap.jsx`, `HeatmapDayModal.jsx`.

4. **Extract Screen-Level Pages:**
   - Create `src/pages/HomePage.jsx`, `AccountPage.jsx`, `ActivityPage.jsx`, `MembersPage.jsx`, `DashboardPage.jsx`, `ClubChallengePage.jsx`, `ResetPasswordPage.jsx`.

5. **Assemble `src/App.jsx` and Clean `src/main.jsx`:**
   - `src/App.jsx` manages top-level state, fetches initial data, wires handlers, and renders Navbar, the active page component, Modals, and MobileNav.
   - `src/main.jsx` imports `App`, registers service worker, attaches window error listeners, and calls `createRoot().render()`.

6. **Validation and Verification:**
   - Run `npm test` to verify node test suite (40/40 tests).
   - Run `npm run build` to verify Vite bundle building without errors.
   - Verify dev server starts and handles API requests properly.

