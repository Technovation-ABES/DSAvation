# Personal Project Structure Guide

## A. My General Organisation Style

This guide is based only on the workspace's `Frontend/` and `Backend/` directories. Their names are capitalized in this Linux workspace; they are treated here as the frontend and backend trees named in the analysis request.

The broad pattern is to keep practice work grouped by topic or project, with each app usually remaining an independent project. In `Frontend/React/`, examples are grouped under areas such as `Basics/`, `React-Router/`, `Redux/`, `MiniProjs/`, `Youtube/`, and `Other/`. Most of these individual apps have their own package manifest and Vite entry files. Backend exercises are similarly grouped by lesson or project under `Backend/`, with project-local manifests and a progression from single-file exercises to apps with separate route, controller, model, and configuration modules.

There is no single rigid architecture applied everywhere. Small exercises are deliberately flatter; fuller applications introduce folders as responsibilities become distinct. Preserve a target project's existing framework, module system, scale, and established conventions rather than expanding every project into the largest observed layout.

## B. Frontend Organisation

### Observed layout

The frontend directory is organized first by subject/project, then by each app's own source tree. Simple React/Vite exercises commonly use `src/main.jsx`, `src/App.jsx`, `src/index.css`, and a small `src/components/` folder. Examples include `Frontend/React/Basics/form/` and `Frontend/React/React-Router/day02-dynamic-routing/`.

Larger apps separate routed screens from reusable components and add folders for the supporting responsibilities they use. `Frontend/React/MiniProjs/Crate/src/` is the most developed observed example:

```text
src/
  App.jsx
  main.jsx
  index.css
  api/
    axiosInstance.js
  assets/
  components/
    common/
    layout/
    notes/
    products/
    ui/
  context/
  data/
  hooks/
  pages/
  routes/
  utils/
```

This is an observed fuller-app shape, not a requirement to create every folder. For example, Crate has pages such as `NotesPage.jsx` and `ProductsPage.jsx`, route guards in `routes/`, reusable note components in `components/notes/`, and shared controls under `components/common/` and `components/ui/`.

Other observed variations include:

- Router-focused projects put route definitions and guards in `src/routes/`, screens in `src/pages/`, and shared UI in `src/components/`, as in `Frontend/React/React-Router/day02-dynamic-routing/src/`.
- Redux projects use `src/app/store.jsx` and `src/features/*Slice.jsx`; a larger example also has `pages/`, `layout/`, `routes/`, `hooks/`, and `components/` in `Frontend/React/Redux/day03-project/src/`.
- Context examples place context code in `src/context/`, for example `Frontend/React/Basics/ContextApi/src/context/MyContext.jsx`.
- API-related code appears in `src/api/` in Crate and `src/apis/` in `Frontend/React/Other/Debouncing-and-Throtlling/`. This spelling is inconsistent; do not rename a project's folder just to match one of these examples.

### Components, pages, and modules

- A small app may put most composition in `App.jsx` and use a flat `components/` directory. Do not create a `pages/` layer where there are no distinct routed screens.
- Apps with multiple routes commonly use `pages/` for screen-level components and `components/` for shared or feature-specific UI.
- Larger component collections may be grouped by purpose (`components/notes/`, `components/products/`, `components/layout/`) and may also have shared `common/` or `ui/` groups. These groups are demonstrated in Crate; the precise split is not consistent across every project.
- Hooks have appeared under `hooks/` and follow the `use...` name pattern, such as `useFetch.js`, `useForm.js`, and `useDebounce.js`.
- Shared context modules are in `context/`; route declarations and guards are in `routes/`; small reusable transformations/validation helpers are in `utils/`; local static data can live in `data/`.
- API calls are not consistently separated into a formal service layer. The observed patterns include a configured Axios instance in `api/axiosInstance.js` and a small API function module in `apis/userApi.jsx`.

### Styling and assets

- Many React exercises use one project-level `src/index.css` imported by `src/main.jsx`. Do not assume there is a component stylesheet for every component.
- The fuller Crate project uses Tailwind CSS v4 through `@import "tailwindcss"` in `src/index.css`, defines theme tokens there, and uses utility classes in JSX. This is a project-specific styling choice, not evidence that every frontend project should be converted to Tailwind.
- Vite projects commonly have a root `public/` folder for public files such as `icons.svg` and `favicon.svg`. Bundled application images/icons may instead be under `src/assets/` and imported by source files.
- Some exercises also have a project-root `image.png`; this appears in individual examples and is not a consistent asset-placement rule. For a reorganization, preserve how the target app currently references its static files.

### Routing and state

- Route definitions commonly live in `src/routes/AppRoutes.jsx`; route guards may sit beside them in that folder. Some small apps instead define routing directly in `App.jsx`.
- Layout components are used when routes share page chrome; names and folder spelling vary (`layout/` and `layouts/` are both present).
- State examples use either React Context (`context/`) or Redux Toolkit (`app/store.jsx`, `features/*Slice.jsx`). These are alternatives demonstrated by different projects, not layers to combine by default.

## C. Backend Organisation

### Observed progression and layouts

Backend exercises range from single-file Express apps to separated modules. The simple `Backend/00-Basics/day03-CRUD/server.js` keeps routes, in-memory data, and request handling in one file. `Backend/00-Basics/day04-dbConnection/` introduces `src/app.js`, `src/config/db.js`, and `src/models/note.model.js`. Later projects commonly add a server entry point and separate route modules.

A recurring layered shape is visible in `Backend/05-Validation/src/` and `Backend/08-Zomato/server/src/`:

```text
src/
  server.js
  app.js                 # or app/app.js in some projects
  config/
  routes/
  controllers/           # called controller/ in some projects
  models/                # called model/ in some projects
  middleware/            # called middlewares/ in one fuller project
  validators/            # present in the validation example
  utils/
```

Not every project has all of these folders. For a feature-rich observed example, `Backend/08-Zomato/server/src/` has `app.js`, `server.js`, `config/`, `routes/`, `controllers/`, `models/`, `middlewares/`, and `utils/`. The route modules mount under API prefixes; controllers implement endpoint behavior and use models and focused helpers.

### Responsibilities found in code

- **Application setup:** An app module creates the Express app, installs parsers/logging, mounts route modules, and may register not-found/error handling. Examples include `Backend/02-Access-Refresh-Token/src/app/app.js`, `Backend/07-Aggregation&Indexing/src/app.js`, and `Backend/08-Zomato/server/src/app.js`.
- **Server startup:** `server.js` commonly imports the app, connects to the database, and starts listening. The exact startup split varies; follow the target project's entry point instead of moving code solely to match a template.
- **Routes:** Route files generally define an Express router, map HTTP methods and paths to handlers/middleware, then export the router. Mounted prefixes such as `/api/auth` or `/api/restaurants` are configured by the app.
- **Controllers:** Where present, controllers contain endpoint request/response work and often call Mongoose models directly. For example, `Backend/08-Zomato/server/src/controllers/restaurant.controller.js` performs queries, creates/updates/deletes documents, and formats responses. A separate service/business-logic layer is not a consistent observed pattern.
- **Models:** Model modules define Mongoose schemas/models. Names include `user.model.js`, `restaurant.model.js`, and, in the aggregation lesson, entity-style names such as `User.js` and `Post.js`.
- **Middleware and validation:** Authentication and error middleware are separate modules in fuller projects. Request validation has its own `validators/` folder in `Backend/05-Validation/`; other projects validate in route/controller handlers.
- **Configuration and database:** Database connection code is commonly in `config/db.js`. Environment settings appear in `config/config.js` or a centralized `config/env.js`. In the fuller Zomato example, `env.js` is the documented single reader of `process.env`, and `db.js` consumes that object. Earlier projects also call `dotenv.config()` in a different module, so centralization is a demonstrated option but not universal.
- **Utilities and seed data:** `utils/` holds focused helpers such as token, pagination, ownership, or code-generation functions. `Backend/07-Aggregation&Indexing/src/seed/` groups the seed script and data separately.

## D. Naming Conventions

These are tendencies, not uniform rules:

- React components and page components usually use PascalCase filenames, such as `ProductCard.jsx`, `HomePage.jsx`, and `AuthLayout.jsx`.
- React hooks use the `use` prefix and camelCase (`useFetch.js`, `useLocalStorage.js`). Utilities and API functions use camelCase (`formatters.js`, `getUsers`).
- React entry files are commonly `main.jsx`, `App.jsx`, and `index.css`. Route collections often use `AppRoutes.jsx`.
- Backend modules commonly use a lowercase domain name plus a role suffix: `auth.routes.js`, `user.model.js`, `restaurant.controller.js`, and `auth.middleware.js`. The `08-Zomato` middleware directory uses plural `middlewares/`.
- Backend function and local variable names are generally camelCase. Configuration keys and environment variables are often uppercase (`MONGO_URI`, `ACCESS_TOKEN_SECRET`).
- Folder names are usually lowercase descriptive nouns, but there are exceptions (`FormLS`, `MiniProjs`, and inconsistent `layout`/`layouts`). Preserve existing casing where possible, especially on case-sensitive filesystems.
- Model filenames are not uniform: most examples use lowercase `*.model.js`, while the aggregation project uses capitalized entity filenames such as `User.js` and `Post.js`.

## E. Code Organisation

The observed organizing principle is incremental separation: keep a small lesson simple; split responsibilities when the app has enough distinct screens, routes, shared UI, authentication, or data modules to benefit.

On the frontend, screen-level components are separated from reusable components in fuller routed apps. Related UI may be grouped by feature, while cross-feature layouts and common controls have their own component groups. Routing, state, hooks, API access, static data, and utilities are separated when the project uses them.

On the backend, later examples separate app setup, route registration, endpoint handlers, schemas, middleware, validators, and helpers. The separation is not absolute: `01-Authentication/src/app/app.js` contains routes and their request logic directly, and `04-URL-Shortener` performs database work in route handlers. Controllers in fuller examples also access models directly. Do not invent a service/repository layer when the target code and its scale do not call for one; no consistent services folder was observed in the inspected backend examples.

## F. Imports and Exports

- Frontend imports are generally relative between local modules. Some entry files include extensions (`./App.jsx`, `./routes/AppRoutes.jsx`), while many internal imports omit them. Preserve the target project's resolver and existing convention.
- Both default and named exports are used. Small components and route modules often default-export their component/router; Crate also uses named exports for components, hooks, utilities, and route functions. The Redux store and slice reducers illustrate named store/action exports alongside a default reducer export. Do not convert an entire project to one export style during reorganization.
- Frontend package usage includes both `react-router` and `react-router-dom` imports in different examples. Keep the existing dependency/import pattern rather than normalizing it without a separate migration request.
- Backend module syntax differs by project. Several projects use ES module `import`/`export`; `08-Zomato` uses CommonJS `require`/`module.exports`. Some earlier files also mix module styles. Keep a project's configured module system and avoid introducing a mixed style as part of file moves.
- Backend local imports usually follow the directory layout with relative paths. Route modules import handlers/models/helpers as needed and app modules import routers.

## G. Preferred Structure Templates

Use the closest observed shape, and include only folders needed by the target project.

### Small React app

```text
project/
  package.json
  index.html
  public/
  src/
    main.jsx
    App.jsx
    index.css
    components/
```

This reflects the simple Vite examples under `Frontend/React/Basics/`. Add `pages/` and `routes/` only when the project has distinct routed screens, as in the router examples.

### Fuller React app

```text
project/
  package.json
  public/
  src/
    main.jsx
    App.jsx
    index.css
    api/                 # or apis/, matching the existing project
    assets/
    components/
      common/
      layout/
      [feature]/
      ui/
    context/             # when using Context
    data/                # when local data modules exist
    hooks/
    pages/
    routes/
    utils/
```

This is modeled on Crate and other routed React examples, not a checklist. If Redux is already used, `app/store.jsx` and `features/` are observed locations; do not add them to Context-based apps by default.

### Simple Express exercise

```text
project/
  package.json
  server.js             # or src/server.js, following the existing app
```

Keep a small lesson's route logic inline if that is how the existing project is organized. A database-backed lesson may add `src/app.js`, `src/config/db.js`, and `src/models/` as demonstrated in `Backend/00-Basics/day04-dbConnection/`.

### Layered Express project

```text
project/
  package.json
  src/
    server.js
    app.js               # or app/app.js, matching the current project
    config/
      db.js
      env.js             # if configuration is centralized
    routes/
    controllers/         # or controller/
    models/               # or model/
    middleware/           # or middlewares/
    validators/           # when request validation is separated
    utils/
```

This reflects the later backend examples, especially `Backend/05-Validation/`, `Backend/07-Aggregation&Indexing/`, and `Backend/08-Zomato/`. Keep only applicable modules and preserve the existing singular/plural folder spelling and module system.

## H. Rules for Future Project Organisation

An AI agent reorganizing another project according to this guide must:

1. Inspect the target project's own files and conventions first. Use this guide as evidence of the user's style, not permission to replace a working structure with a generic architecture.
2. Keep the project's current framework, build tool, package/module type, and routing/state choices. Do not introduce a technology merely because it appears in a different sample.
3. Keep small projects flat when their responsibilities are still small. Add `pages/`, `routes/`, `controllers/`, or similar folders only when the project has corresponding distinct modules or a clear existing pattern for them.
4. In React projects, keep screen-level pages separate from reusable components when that separation already exists or multiple routed screens make it useful. Group feature UI only when the target has comparable feature boundaries.
5. Keep route definitions and guards in the project's established route location; do not create a second routing system or move all code out of `App.jsx` without a project-specific reason.
6. Preserve existing state ownership: Context and Redux are both evidenced, but they are alternatives in the examples. Do not add a new state layer during a structural move.
7. Preserve styling strategy and static asset behavior. `index.css`, Tailwind, `public/`, and `src/assets/` all occur in the samples; choose based on the target's current imports and references.
8. For backend apps, keep Express app setup and server startup aligned with the current project. Where routes/controllers/models already exist, maintain their boundaries and route-to-handler flow.
9. Keep request validation in its existing location. A `validators/` module is evidenced in one project, while other examples validate in route/controller code; do not move validation just to match a single sample.
10. Do not add a `services/` or repository layer by default. The inspected projects commonly perform data operations in route handlers or controllers and do not establish a repeated service-layer convention.
11. Preserve the target's existing file suffixes, capitalization, singular/plural directory names, and default/named export style. The samples are inconsistent in these details.
12. Keep secrets in environment configuration; never copy values from environment files into source. The observed configuration modules read variables such as `MONGO_URI` and token secrets, but environment-file contents are not part of this guide.
13. Move only what is required for the requested organization, then update local imports and entry references consistently. Do not combine reorganization with behavioral refactors or unrelated cleanup.
14. When a target project's pattern conflicts with a rule here, prefer the target's established working convention and record the conflict rather than silently forcing a template.

## I. Inconsistencies and Uncertainties

### Observed inconsistencies

- The actual workspace folders are `Frontend/` and `Backend/` with capital initials, rather than lowercase names.
- Frontend API folders appear as both `api/` and `apis/`; layout folders appear as `layout/` and `layouts/`.
- Frontend projects use both default and named exports, and local import extensions are inconsistent.
- Route imports use both `react-router` and `react-router-dom` in different projects.
- Backend source roots vary (`server.js` at project root, `src/server.js`, or a nested `backend/`/`server/` project); app modules may be `src/app.js` or `src/app/app.js`.
- Backend folders vary between `model/` and `models/`, `controller/` and `controllers/`, and `middleware/` and `middlewares/`.
- Backend module syntax varies between ES modules and CommonJS. Some older files also mix the forms, so that mixture should be treated as an existing project condition, not a preferred convention to reproduce.
- Backend endpoint logic ranges from inline handlers to separate controllers. Database operations are not consistently placed behind a service layer.
- Frontend styling ranges from a global CSS file to Tailwind utility classes and theme tokens. There is not enough repeated evidence to prescribe one style system across projects.

### Limits of the evidence

- The directories contain exercises at different stages and sizes. A pattern in one larger app may be a project-specific decision rather than a universal preference.
- No consistent frontend service-layer convention or backend service/repository convention was established by the inspected examples.
- Environment handling is not uniform: there are centralized config modules, but earlier examples load dotenv elsewhere. Do not infer a single mandatory configuration layout.
- This guide describes observed organization, not the correctness or quality of every implementation detail. Reorganization should preserve intended behavior and avoid copying obvious implementation mistakes as conventions.