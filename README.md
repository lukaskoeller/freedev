
# freedev

![We are freedev](freedev-og-image.png)

## Design

The screendesigns are hosted in Figma (see [Figma Designs](https://www.figma.com/file/6XVMGp0k7nCGlJ85Nrip5f/freedev?node-id=0%3A1))

## Development Workflow

When running `npx` in a workspace, make sure running its command does not install any missing modules. This must happen only from root using the `-w <name-of-packge | name-of-app>` flag. If you run `npx`, run it with `--no-install` so npx try to omit any install of missing modules.

## What's inside?

This turborepo uses [NPM](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `@freedev/web`: A [SvelteKit](https://kit.svelte.dev/) App as the web platform.
- `assets`: Storing static assets used across packages and apps.
- `config`: `eslint` and `postcss` configurations.
- `errors`: Handling errors via custom classes (e.g. network errors).
- `functions`: Manages serverless functions (Lambdas).
- `@freedev/infrastructure`: AWS serverless cloud infrastructure using [Pulumi](https://www.pulumi.com/).
- `tsconfig`: `tsconfig.json`s used throughout the monorepo.
- `types`: Shared Typescript types.
- `ui`: A [Lit](https://lit.dev/) component library running [storybook](https://storybook.js.org/) and [vite](https://vitejs.dev/).

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting

## Infrastructure

![AWS serverless infrastructure for freedev](freedev-aws-infrastructure.png)

## Setup

This repository is used in the `npx create-turbo@latest` command, and selected when choosing which package manager you wish to use with your monorepo (NPM).

### Build

To build all apps and packages, run the following command:

```sh
cd my-turborepo
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```sh
cd my-turborepo
npm run dev
```
