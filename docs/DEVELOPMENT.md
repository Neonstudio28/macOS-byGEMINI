# Development Notes

The project is built with React, TypeScript, and Vite.

## Common commands

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs the configured lint checks.
- `npm run preview` previews the production build locally.

Keep reusable UI logic close to its feature area, prefer typed interfaces for shared data, and avoid committing generated build output.

## Development workflow

Make one focused change at a time, validate the affected interaction locally, then run linting and a production build before opening a pull request. Keep platform-specific behavior isolated so shared UI remains portable.