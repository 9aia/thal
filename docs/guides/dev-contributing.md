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
- **[Roadmap](/pm/ROADMAP.md)**: Key milestones and planned features to guide development.
- **[Backlog](/pm/BACKLOG.md)**: A collection of tasks and ideas pending implementation.
- **[Todo](/pm/TODO.md)**: The current tasks we’re working on.
- **[Suggestions](/pm/SUGGESTIONS.md)**: Concepts and ideas under review for potential inclusion.
- **[Changelog](/pm/CHANGELOG.md)**: A detailed record of updates, changes, and improvements.
- **Archived**
  - **[Backlog](/pm/archived/BACKLOG.md)**: A record of ideas that have been set aside and will not be pursued.

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

- To host, run `pnpm run up`
- To connect, run `pnpm dev:cs`

// TODO

Don't forget to modify `./codeshare/co-authors`.

- To run commands inside the codeshare container, run `pnpm cs {command}`

Here's an improved version of your release/deployment instructions, with enhanced clarity, formatting, and consistency:

---

## Releasing and Deploying

**Note**: Before deploying to production, preview the application remotely. If needed, also test it locally to ensure everything works as expected.

### Releasing

1. **Update the Changelog**
   - Manually update the changelog sections following the standard described here: [Keep a Changelog](https://www.npmjs.com/package/@release-it/keep-a-changelog).
   - Do **not** specify the next version in the changelog. Leave it as `## [Unreleased]`, which will be automatically updated with the version and release date.
   - For more details, refer to the [Conventional Changelog documentation](https://github.com/release-it/conventional-changelog).

2. **Login to Wrangler**
  - Authenticate with Cloudflare’s Wrangler CLI to manage your deployment.
  - Run the following command to log in:
   ```bash
   npx wrangler login
   ```

3. **Ensure .env.preview and .env.prod**
   - Ensure all necessary `.env` variables are up to date, especially:
     - `STRIPE_ENDPOINT_SECRET` (for Stripe integrations)

4. **Run the Release Command**
   Once the changelog is updated, run the following command to release the update:
   ```bash
   pnpm release
   ```

5. **Select the Next Version**
   Choose the next version based on [semantic versioning](https://semver.org/). Make sure to determine whether it is a major, minor, or patch release based on the changes since the last release.

### Deploying Preview without Releasing

To deploy a preview version without creating a release, use the following command:

```bash
pnpm run build:preview && pnpm run deploy
```

### Preview Locally Using Wrangler

To build the application for production and preview it locally with Wrangler, run:

```bash
pnpm run build && npx wrangler dev .output/server/index.mjs --assets .output/public/
```

### Preview Locally Using Nuxt

To build the application for production and preview it locally using Nuxt, run:

```bash
pnpm run build && pnpm run preview
```

## Useful Links

- [Icons](https://fonts.google.com/icons)

## Reference

For further information, please refer to the official documentation of the relevant technologies.
