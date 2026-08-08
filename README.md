# No Code Page Builder

A Turborepo workspace for comparing React state management approaches in the same page builder
application.

## Apps

- `context-app`: Next.js app using React Context API and `useReducer`
- `redux-app`: Next.js app using Redux Toolkit

## Packages

- `@repo/ui`: shared React UI components
- `@repo/eslint-config`: shared ESLint configuration
- `@repo/typescript-config`: shared TypeScript configuration

## Development

```bash
pnpm --filter context-app dev
```

```bash
pnpm --filter redux-app dev
```

- context-app: http://localhost:3000
- redux-app: http://localhost:3001
