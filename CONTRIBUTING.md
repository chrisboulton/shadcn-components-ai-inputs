# Contributing

## Development Setup

```bash
git clone https://github.com/chrisboulton/shadcn-components-ai-inputs.git
cd shadcn-ai-input-components
npm install
npm run dev
```

The example app runs at `http://localhost:5173`.

## Scripts

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run dev`            | Start dev server with example app |
| `npm run typecheck`      | Run TypeScript type checking      |
| `npm run lint`           | Run ESLint                        |
| `npm run format`         | Format code with Prettier         |
| `npm run registry:build` | Build shadcn registry JSON files  |

## Project Structure

```
src/components/ui/      # AI input components (registry source)
src/lib/                # Shared utilities
examples/vite/          # Vite example app
registry.json           # shadcn registry definition
```

## Pull Requests

1. Fork and create a feature branch
2. Make changes in `src/`
3. Update the example in `examples/vite/` if applicable
4. Run `npm run typecheck && npm run lint` before submitting
5. Open a PR with a clear description of the change
