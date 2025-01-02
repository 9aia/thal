# Developer Contribution Guide

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
git clone https://github.com/9aia/thal.git
cd thal/
```

Make sure to install the dependencies:

```bash
pnpm install
```

## Project Management

At Gaia, we’re dedicated to transparent and community-driven development. Curious about what’s on the horizon or how we bring ideas to life? Dive into our roadmap to stay updated on current progress, upcoming features, and key milestones. From brainstorming sessions to prioritized tasks, we’re excited to share every step of Thal’s journey with you. Explore the resources below to stay connected and see how Thal grows with each contribution!

- **[Project Overview](/pm/OVERVIEW.md)**: A summary of Thal's mission, vision, and progress.
- **[Backlog](/pm/BACKLOG.md)**: A list of tasks and ideas yet to be implemented.
  - **[Archived](/pm/archived.md)**: Ideas that won’t be pursued.
  - **[To Revise](/pm/to-revise.md)**: Concepts under review for potential inclusion.
- **[Changelog](/pm/CHANGELOG.md)**: A detailed record of updates, changes, and improvements.
- **[Roadmap](/pm/ROADMAP.md)**: Major milestones and planned features.
- **[Todo](/pm/TODO.md)**: The current tasks we’re actively working on.

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

### Pushing

#### Setup

To ensure your changes are synchronized across both GitHub and Gitea repositories, configure your origin remote with multiple push URLs:

```
git remote set-url --add --push origin ssh://git@gitea.homelab.vini.center:2222/9aia/thal.git
git remote set-url --add --push origin git@github.com:9aia/thal.git
```

#### Pushing

Once set up, you can push your changes to both repositories with a single command:

```
git push
```

## Sharing Code

// TODO

Don't forget to modify `./codeshare/co-authors`.

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

## Useful Links

- [Icons](https://fonts.google.com/icons)

## Reference

For further information, please refer to the official documentation of the relevant technologies.
