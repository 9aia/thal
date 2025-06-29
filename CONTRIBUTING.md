# Contributing <!-- omit in toc -->

- [Managing the Project](#managing-the-project)
- [Preparing the Environment Locally](#preparing-the-environment-locally)
- [Developing](#developing)
  - [Joining a Codeshare](#joining-a-codeshare)
    - [Using VSCode Directly](#using-vscode-directly)
    - [Using the `dev:cs` Script](#using-the-devcs-script)
  - [Running the Development Environment Locally](#running-the-development-environment-locally)
  - [Stopping the Development Environment](#stopping-the-development-environment)
  - [Writing Code](#writing-code)
  - [Managing the Database](#managing-the-database)
    - [Migrating the Database](#migrating-the-database)
    - [Applying the Migrations](#applying-the-migrations)
  - [Interacting with the Database](#interacting-with-the-database)
  - [Interacting with the API](#interacting-with-the-api)
  - [Managing the Local Containers](#managing-the-local-containers)
  - [Committing Code](#committing-code)
  - [Pushing Code to the Repositories](#pushing-code-to-the-repositories)
  - [Previewing Builds](#previewing-builds)
  - [Deploying Preview without Releasing](#deploying-preview-without-releasing)
- [Designing](#designing)
  - [Designing the UI](#designing-the-ui)
- [Managing the Content](#managing-the-content)
  - [Translating the Content](#translating-the-content)
  - [Cleaning Up the Content](#cleaning-up-the-content)
  - [Adjusting Generated Content](#adjusting-generated-content)
- [Managing the Infrastructure](#managing-the-infrastructure)
- [Releasing](#releasing)
- [Useful Links](#useful-links)
- [Reference](#reference)

## Managing the Project

> [!NOTE]
> You can edit the project management documents directly in the `./pm` folder via GitHub website, but it's recommended to edit the documents locally or in a codeshare.

We approach the project management in a git-based way. We foster an intuitive, transparent and proactivity-driven process. You can find all the project management documents in the `./pm` folder.

Here's a brief overview of the documents:

- **[Project Overview](/pm/OVERVIEW.md)**: A summary of Thal's mission, vision, and progress.
- **[Roadmap](/pm/ROADMAP.md)**: Key milestones and planned features to guide development.
- **[Backlog](/pm/BACKLOG.md)**: A collection of tasks and ideas pending implementation.
- **[Todo](/pm/TODO.md)**: The current tasks we’re working on.
- **[Suggestions](/pm/SUGGESTIONS.md)**: Concepts and ideas under review for potential inclusion.
- **[Changelog](/pm/CHANGELOG.md)**: A detailed chronological record of updates, changes, and improvements.
- **Archived**
  - **[Backlog](/pm/archived/BACKLOG.md)**: A record of ideas that have been set aside and will not be pursued.

## Preparing the Environment Locally

> [!NOTE]
> If you are joining a codeshare, you can skip this section.

You will need to have installed an IDE. It's recommended to use [Vscode](https://code.visualstudio.com/download) or any Vscode compatible editor.

1. **Install the main dependencies**
   - Ensure you have the following prerequisites installed on your system:
      - [Git](https://git-scm.com/downloads)
      - [Docker](https://docs.docker.com/)
      - [Docker Compose](https://docs.docker.com/compose)
      - [Node.js 23.8 or higher](https://nodejs.org/en)
      - [PNPM 9.10 or higher](https://pnpm.io/installation)

2. **Configure the IDE (recommended)**
  - For Visual Studio Code, consider installing the following extensions:
    - [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
    - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
    - [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)
    - [Nuxt MDC](https://marketplace.visualstudio.com/items?itemName=Nuxt.mdc)
    - [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
    - [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (optional)
    - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) (optional)
    - [Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) (optional if you are using Cursor or another AI code assistant)

3. **Clone the repository**

   Clone the repository to your local machine:

   ```sh
   git clone https://github.com/9aia/thal.git
   cd thal/
   ```

4. **Install the dependencies**

   Make sure to install the dependencies:

   ```bash
   pnpm install
   ```

   This will automatically run the `postinstall` script, which will install the Git hooks and prepare the Nuxt files.

5. **Apply the migrations**

   Apply the migrations:

   ```bash
   pnpm db:migrate
   ```

6. **Configure the origin remote**

   To ensure your changes are synchronized across both GitHub and Gitea repositories, configure your origin remote with multiple push URLs:

   ```bash
   git remote set-url --add --push origin ssh://git@gitea.homelab.vini.center:2222/9aia/thal.git
   git remote set-url --add --push origin git@github.com:9aia/thal.git
   ```

## Developing

### Joining a Codeshare

#### Using VSCode Directly

> [!WARNING]
> It's not recommended. The issue with this is that you will have to manually specify all the variables, such as IDE command, host, port, root folder, etc.

You can join a codeshare by running the following command directly:

```bash
code --remote "ssh-remote+codeshare@9aia-dev.com:2222" ./codeshare/
code --new-window --remote "ssh-remote+codeshare@9aia-dev.com:2222" ./codeshare/ # if you want to open a new window
```

#### Using the `dev:cs` Script

> [!NOTE]
> This is the recommended way to join a codeshare, but you will have to have the repository cloned locally.

To join a codeshare, you need to run the following command:

```bash
pnpm run dev:cs
```

### Running the Development Environment Locally

1. **Start the containers**
   - To start the containers, run:
     ```bash
     pnpm run up
     ```
   - This will start the Stripe container and the codeshare container.

2. **Start the development server**
   - Start the development server on `http://localhost:3000`
     ```bash
     pnpm run dev
     ```

### Stopping the Development Environment

To stop the development environment, you need to run the following command:

```bash
pnpm run down
```

This will stop the Stripe and codeshare containers running in the background.

### Writing Code

> [!NOTE]
> Don't forget to run `pnpm cf-typegen` to generate the Cloudflare types.

We use [Eslint](https://eslint.org/) to help us with the code quality and consistency. It's automatically fix the linting issues when you save the files. You can also run it manually with `pnpm lint` to check the issues or `pnpm lint:fix` to fix the issues.

We also use [Vue Tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) to help us with the type safety. It's automatically run before the release. You can also run it manually with `pnpm tsc`.

### Managing the Database

We use [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) for managing SQL database migrations.

#### Migrating the Database

To generate the migrations, you need to run the following command:

```bash
pnpm db:generate
```

#### Applying the Migrations

To apply the migrations, you need to run the following command:

```bash
pnpm db:migrate
```

### Interacting with the Database

We don't use a DB studio to interact with the database. We actually write SQL queries using Typescript files with [Castor](https://github.com/9aia/castor). You can find all the SQL queries in `./db-client` folder.

To interact with the database, you can run the following command:

```bash
pnpm db:client
```

Read more about Castor [here](https://github.com/9aia/castor).

### Interacting with the API

For interacting with the API, we utilize the [Vscode REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). You can find all the API requests in `./api-client` folder.

> [!NOTE]
> Remember to set the environment by opening Command Palette and selecting `Rest Client: Switch Environment`.

### Managing the Local Containers

To execute commands in the local containers, you can run the following command:

```bash
pnpm stripe {command} # for the Stripe container
pnpm cs {command} # for the codeshare container
```

### Committing Code

1. **Generate a commit message**
   - Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format, in particular the [Angular Commit Convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).
   - It's recommended to generate a commit message using AI of the IDE you are using. For example, in VSCode, you can use the `Copilot` extension to generate a commit message.
   - Check for warnings of already included authors in the commit message.

2. **Ensure the authors are included**
   - If your programming in a codeshare, don't forget to include the authors in the `co-authors` file.

3. **Commit**
   - Run `git commit` to commit your changes or use the IDE's commit button.

### Pushing Code to the Repositories

Once set up, you can push your changes to both repositories with a single command:

```bash
git push
```

### Previewing Builds

Preview it locally, run:

```bash
pnpm run build && pnpm run preview # for previewing development
pnpm run build:preview && pnpm run preview # for previewing preview
pnpm run build:prod && pnpm run preview # for previewing production
```

### Deploying Preview without Releasing

> [!WARNING]
> This is not the proper way to deploy the application, it's just here for documentation purposes. See [Releasing](#releasing) for the right way.

To deploy a version without creating a release, use the following command:

```bash
pnpm run build && pnpm run deploy # for deploying development
pnpm run build:preview && pnpm run deploy:preview # for deploying preview
pnpm run build:prod && pnpm run deploy:prod # for deploying production
```

## Designing

Our design process is generally intuitive, but we can use different tools to design the application. We also search for inspirations in different sources, such as [Dribbble](https://dribbble.com/), [Behance](https://www.behance.net/) and/or [Pinterest](https://www.pinterest.com/). Also, we can be inspired by existing projects.

We don't use an external full-fledged design system component library, but instead we have a set of technologies that we use to help us with the styling, accessibility, functionality, and other design considerations.

- [DaisyUI](https://daisyui.com/) (for styling)
- [ArkUI](https://ark-ui.com/) (for accessibility, and other design considerations)
- [Iconify](https://icon-sets.iconify.design/) (for icons)
- [Tailwind CSS](https://tailwindcss.com/) and a custom configuration (for design tokens, styling, and other design considerations)

You can find our custom UI components in the `./app/components` folder.

### Designing the UI

We use can use [Stitch](https://stitch.withgoogle.com/) to design the UI.

> [!NOTE]
> Stitch is not a perfect tool, so you may need to change some things to make it better. That's why we use it as a reference, but not as the final design.

## Managing the Content

> [!NOTE]
> You can edit the content directly in the `./app/content` folder or the translations in the `./app/locales` folder via GitHub website, but it's recommended to edit the content locally or in a codeshare.

To manage the content of the application, we use a Git-based CMS called [Nuxt Content](https://content.nuxt.dev/) and an AI-powered framework called [Psitta](https://github.com/9aia/psitta). You can find some of the content in `./app/content` folder and the rest in `./app/locales` folder.

> [!WARNING]
> Psitta is not a perfect tool, so you may need to adjust the generated content manually.

### Translating the Content

To translate the content, you need to run the following command:

```bash
pnpm run psitta translate
```

### Cleaning Up the Content

To clean up Psitta unused messages, you need to run the following command:

```bash
pnpm run psitta cleanup
```

### Adjusting Generated Content

To adjust the generated content, you need to run the following command:

```bash
pnpm run psitta adjust <prompt>
# For example: pnpm run psitta adjust "Make the translation a little bit more formal"
```

## Managing the Infrastructure

We use [Cloudflare](https://www.cloudflare.com/) to manage the infrastructure.

## Releasing

> [!NOTE]
> Before releasing, it's recommended to preview locally the application and to test it to ensure everything works as expected.

1. **Update the Changelog**
   - Manually update the changelog sections following the standard described here: [Keep a Changelog](https://www.npmjs.com/package/@release-it/keep-a-changelog).
   - Do **not** specify the next version in the changelog. Leave it as `## [Unreleased]`, which will be automatically updated with the version and release date.
   - For more details, refer to the [Conventional Changelog documentation](https://github.com/release-it/conventional-changelog).

2. **Ensure your logged in to Cloudflare**
   - Authenticate with Cloudflare’s Wrangler CLI to manage your deployment.
   - Run the following command to log in:
     ```bash
     npx wrangler login
     ```

3. **Ensure .env.preview and .env.prod**
   - Ensure all necessary `.env` variables are up to date, especially:
     - `STRIPE_ENDPOINT_SECRET` (for Stripe integrations)

4. **Run the Release Command**
   After following the steps above, run the following command to release the update:
   ```bash
   pnpm release
   ```

5. **Select the Next Version**
   Choose the next version based on [semantic versioning](https://semver.org/). Make sure to determine whether it is a major, minor, or patch release based on the changes since the last release.

## Useful Links

- [Iconify Icons](https://icon-sets.iconify.design/material-symbols/?keyword=material)

## Reference

For further information, please refer to the official documentation of the relevant technologies.
