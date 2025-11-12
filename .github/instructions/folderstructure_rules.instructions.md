---
applyTo: '**'
---
This document describes the recommended folder structure, naming conventions, and responsibilities for files and folders in the BIS System backend repository.

Use these rules when creating new files, scaffolding features, or asking the AI assistant to modify the codebase. They are intentionally pragmatic and lightweight to match a Node.js / Express / Mongoose codebase.

## Top-level layout (recommended)

Root (example):

```
index.js               # application entry point
package.json
.env                   # local environment values (not committed)
README.md
config/                # configuration helpers (db connections, env parsing)
controllers/           # Express route handlers (per resource)
models/                # Mongoose models / schemas
routes/                # Express route definitions (per resource)
services/              # Business logic and reusable helpers
middleware/            # Express middleware (auth, error handling, upload, etc.)
utils/                 # Small utilities, formatters, helpers
scripts/               # dev / maintenance scripts (seed db, migrate, etc.)
tests/                 # unit/integration tests
uploads/               # local upload storage (if used, gitignored)
.github/               # CI, docs, and internal instructions (may be ignored for public repo)
```

## Folder responsibilities

- `config/`
	- Keep centralized configuration and connection code here.
	- Examples: `database.js`, `index.js` (config loader), `jwt.js` (if you centralize secrets usage).

- `controllers/`
	- Implement Express request handlers. One controller file per resource is a good starting point (e.g., `adminController.js`, `residentController.js`, `authController.js`).
	- Keep controllers thin: validate request, call service, return response.

- `services/`
	- Place business logic and code that can be unit-tested independently of request/response layers. Services are consumed by controllers.
	- Examples: `authService.js`, `referenceService.js`, `fileStorageService.js`.

- `models/`
	- Mongoose schemas and model exports. Prefer one model per file named after the model (e.g., `User.js`, `Request.js`).

- `routes/`
	- Wire Express routes to their controllers. Keep route files small and focused (e.g., `auth.js`, `admin.js`, `resident.js`).

- `middleware/`
	- Auth checks, role guards, error handlers, request validators. Export functions and reference them from route definitions.

- `utils/`
	- Small utilities, formatters, and shared helper functions. Avoid business logic here.

- `scripts/`
	- CLI utilities and small scripts, for example `seed.js`, `migrate.js`. Make scripts idempotent where possible.

- `tests/`
	- Unit and integration tests. Structure tests to mirror the source layout when possible.

## Naming conventions

- Files: use `camelCase` or `kebab-case` consistently. This repository prefers `camelCase` for JS files (e.g., `adminController.js`, `authService.js`).
- Mongoose models: PascalCase model name inside file and filename matching the model (e.g., `User.js` exports `User`).
- Routes: name route files after the resource (e.g., `admin.js`, `resident.js`).
- Tests: mirror the name of the file they test and place under `tests/` (e.g., `tests/controllers/adminController.test.js`).

## File contents and patterns

- Controllers should follow this minimal pattern:

```js
// controllers/exampleController.js
const exampleService = require('../services/exampleService');

exports.doThing = async (req, res, next) => {
	try {
		const result = await exampleService.doThing(req.body);
		res.json({ message: 'OK', data: result });
	} catch (err) {
		next(err);
	}
};
```

- Services should be pure JS modules that export functions used by controllers. Prefer returning data objects and throwing errors rather than sending responses directly.

## Error handling

- Centralize error handling in `middleware/errorHandler.js` and call `next(err)` from controllers.
- Use custom error classes (optional) to encode status codes and messages.

## Auth and security

- Put JWT-related helpers in `config/` or `services/authService.js` depending on complexity.
- Keep secrets (JWT secret, DB credentials) in environment variables. Do not commit `.env`.

## Static assets and uploads

- Keep uploads under `uploads/` and add that folder to `.gitignore`. For production, use cloud storage.

## Tests

- Use `tests/` to group unit and integration tests. Prefer small focused tests for services and use a test database for integration tests.

## Example feature scaffold

When adding a new resource `Foo`:

1. Create `models/Foo.js` (Mongoose model)
2. Create `services/fooService.js` (business logic)
3. Create `controllers/fooController.js` (handlers)
4. Create `routes/foo.js` and wire it into `index.js` or your main router
5. Add tests under `tests/services/fooService.test.js` and `tests/controllers/fooController.test.js`

## Git and commit guidelines

- Keep commits small and focused. Use feature branches and descriptive commit messages.
- Add `.github/instructions/` to `.gitignore` before publishing if these internal instruction files should not be public.

## When to deviate

This structure balances clarity and simplicity. For larger projects consider splitting into `src/` and `lib/`, adding TypeScript, or adopting a hexagonal architecture. If a change improves clarity or testability, prefer it — but document deviations.

---

If you'd like, I can create a small scaffold of empty folders and example files in the repository following these rules. Tell me which features you want scaffolded and I'll create them.