# Contributing

## Installing

Before proceeding with the installation, ensure you have the following prerequisites installed on your system:

- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose)

To set up the development environment, ensure you have the following tools installed:

- [Vscode](https://code.visualstudio.com/download)
- [Node.js 21](https://nodejs.org/en)
- [PNPM 8](https://pnpm.io/installation)

For Visual Studio Code, consider installing the following extensions:

- [Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (optional)
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) (optional)
  - [SQLTools SQLite Driver](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-sqlite)
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (optional)
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (optional)

Clone the repository to your local machine:

```sh
git clone https://github.com/maratongue/maratongue
cd maratongue/
```

Make sure to install the dependencies:

```bash
pnpm install
```

## Developing

### SQL Migrations

Generate SQL migrations:

```bash
pnpm db:generate
```

Apply those migrations:

```bash
pnpm db:migrate
```

### Development Server

Start the Stripe container using Docker:

```bash
pnpm run up
```

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

### Testing API

For testing the API, we utilize the [Vscode REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). You can find all the API requests in `./api-client` folder.

> [!NOTE]
> Remember to set the environment by opening Command Palette and selecting `Rest Client: Switch Environment`.

### Committing

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
  - [Angular Commit Convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

## Deploying

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Reference

For further information, please refer to the official documentation of the relevant technologies.
