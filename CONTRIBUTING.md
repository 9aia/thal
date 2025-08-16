# Contributing to Thal <!-- omit in toc -->

Thank you for your interest in contributing to Thal! This document provides guidelines and information for contributors.

- [Managing the Project](#managing-the-project)
- [Preparing the Environment](#preparing-the-environment)
  - [Preparing the Basic Environment](#preparing-the-basic-environment)
  - [Joining a Codeshare](#joining-a-codeshare)
    - [Opening from CLI](#opening-from-cli)
    - [Using the `dev:cs` Script](#using-the-devcs-script)
  - [Preparing the Local Repository](#preparing-the-local-repository)
  - [Preparing the Full Environment Locally](#preparing-the-full-environment-locally)
  - [Creating a Codeshare Session](#creating-a-codeshare-session)
  - [Preparing the Network](#preparing-the-network)
    - [Preparing the Network for Hosting a Codeshare](#preparing-the-network-for-hosting-a-codeshare)
    - [Preparing the Network for Joining a Codeshare](#preparing-the-network-for-joining-a-codeshare)
- [Contributing](#contributing)
  - [Committing](#committing)
  - [Pushing to the Repositories](#pushing-to-the-repositories)
  - [Creating Pull Requests](#creating-pull-requests)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Developing](#developing)
  - [Running the Development Environment](#running-the-development-environment)
  - [Stopping the Development Environment](#stopping-the-development-environment)
  - [Writing Code](#writing-code)
  - [Checking Code Quality](#checking-code-quality)
  - [Managing the Database](#managing-the-database)
    - [Migrating the Database](#migrating-the-database)
    - [Applying the Migrations](#applying-the-migrations)
  - [Interacting with the Database](#interacting-with-the-database)
  - [Interacting with the API](#interacting-with-the-api)
  - [Managing the Local Containers](#managing-the-local-containers)
  - [Previewing Builds](#previewing-builds)
  - [Getting AI Assistance](#getting-ai-assistance)
  - [Delegating Tasks to AI Software Engineers](#delegating-tasks-to-ai-software-engineers)
- [Designing](#designing)
  - [Designing the UI](#designing-the-ui)
- [Managing the Content](#managing-the-content)
  - [Translating the Content](#translating-the-content)
  - [Cleaning Up the Content](#cleaning-up-the-content)
  - [Adjusting Generated Content](#adjusting-generated-content)
- [Streamlining Operations](#streamlining-operations)
  - [Managing the Infrastructure](#managing-the-infrastructure)
  - [Deploying Preview without Releasing](#deploying-preview-without-releasing)
  - [Releasing](#releasing)
- [Marketing](#marketing)
- [Testing and Assuring Quality](#testing-and-assuring-quality)
- [Useful Links](#useful-links)
- [Getting Help](#getting-help)
  - [Getting Asynchronous Help](#getting-asynchronous-help)
  - [Getting Real-Time Help](#getting-real-time-help)
- [License](#license)

## Managing the Project

> [!TIP]
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

## Preparing the Environment

### Preparing the Basic Environment

Install the following tools:

- [Git](https://git-scm.com/downloads)
- [Node.js 23.8 or higher](https://nodejs.org/en)
- [PNPM 9.10 or higher](https://pnpm.io/installation)
- ([Vscode](https://code.visualstudio.com/download) or any Vscode compatible editor) (recommended)

### Joining a Codeshare

#### Opening from CLI

> [!IMPORTANT]
> Make sure you have set up the network properly. See [Preparing the Network for Joining a Codeshare](#preparing-the-network-for-joining-a-codeshare).

> [!WARNING]
> Make sure to provide properly all connection details, such as the IDE command, host, port, and root folder.

> [!TIP]
> Although this is relatively more convenient since you don't have to prepare a full environment locally, it is still recommended to do so. For a smoother and more reliable experience, refer to [Using the `dev:cs` Script](#using-the-devcs-script).

Here is an example of how to join a codeshare session directly in VSCode:

```bash
code --remote "ssh-remote+codeshare@dev.thal.9aia.com:2222" ./codeshare/
# or if you want to open it in a new window
code --new-window --remote "ssh-remote+codeshare@dev.thal.9aia.com:2222" ./codeshare/
```

> [!NOTE]
> Commands may differ for other editors.

#### Using the `dev:cs` Script

> [!IMPORTANT]
> Make sure you have set up the basic environment locally. See [Preparing the Basic Environment](#preparing-the-basic-environment).

> [!IMPORTANT]
> Make sure you have set up the network properly. See [Preparing the Network for Joining a Codeshare](#preparing-the-network-for-joining-a-codeshare).

To join a codeshare, you need to run the following command:

```bash
pnpm run dev:cs
```

### Preparing the Local Repository

> [!IMPORTANT]
> Make sure you have installed the basic environment locally. See [Preparing the Basic Environment](#preparing-the-basic-environment).

1. **Clone the repository**

   Clone the repository to your local machine:

   ```sh
   git clone https://github.com/9aia/thal.git
   cd thal/
   ```

2. **Configure the origin remote**

   To ensure your changes are synchronized across both GitHub and Gitea repositories, configure your origin remote with multiple push URLs:

   ```bash
   git remote set-url --add --push origin ssh://git@gitea.homelab.vini.center:2222/9aia/thal.git
   git remote set-url --add --push origin git@github.com:9aia/thal.git
   ```

### Preparing the Full Environment Locally

> [!IMPORTANT]
> Make sure you have installed the basic environment locally. See [Preparing the Basic Environment Locally](#preparing-the-basic-environment-locally).

> [!TIP]
> If you are joining a codeshare, you can skip this section.

1. **Install the main dependencies**
   - Ensure you have the following prerequisites installed on your system:
      - [Docker](https://docs.docker.com/)
      - [Docker Compose](https://docs.docker.com/compose)

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

3. **Clone the repository**. See [Preparing the Local Repository](#preparing-the-local-repository) for more details.

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

### Creating a Codeshare Session

> [!IMPORTANT]
> Make sure you have prepared the full environment locally (see [Preparing the Full Environment Locally](#preparing-the-full-environment-locally)) and the network for hosting a codeshare (see [Preparing the Network for Hosting a Codeshare](#preparing-the-network-for-hosting-a-codeshare)).

> [!WARNING]
> You may have to install the Vscode extensions manually inside the codeshare container.

// TODO: add more information about how to create a codeshare session

### Preparing the Network

> [!TIP]
> If you are not working on a codeshare, you can skip this section.

#### Preparing the Network for Hosting a Codeshare

// TODO: add more information about the codeshare networking

#### Preparing the Network for Joining a Codeshare

> [!IMPORTANT]
> Make sure you have set up the network properly. We recommend using [Tailscale](https://tailscale.com/) to connect to the codeshare session.

> [!IMPORTANT]
> Make sure you have configured `/etc/hosts` to point `dev.thal.9aia.com` to the host machine's IP address.

// TODO: add more information about the codeshare networking

> [!IMPORTANT]
> Remember to set `dev.thal.9aia.com:3000` as a secure origin in `chrome://flags/#unsafely-treat-insecure-origin-as-secure` when joining the codeshare. Without this, you will not be able to authenticate to the application.

## Contributing

### Committing

1. **Generate a commit message**
   - Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format, in particular the [Angular Commit Convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).
   - It's recommended to generate a commit message using AI of the IDE you are using. For example, in VSCode, you can use the `Copilot` extension to generate a commit message.
   - Check for warnings of already included authors in the commit message.

2. **Ensure the authors are included**
   - If your programming in a codeshare, don't forget to include the authors in the `co-authors` file.

3. **Commit**
   - Run `git commit` to commit your changes or use the IDE's commit button.

### Pushing to the Repositories

You can use the following command to push your changes to the repository:

```bash
git push --set-upstream origin main # or `git push` if you have already set up upstream
```

### Creating Pull Requests

- Provide a clear description of the changes
- Include any relevant issue numbers
- Ensure all tests pass and code quality checks are satisfied
- Update documentation if necessary

### Submitting a Pull Request

1. **Create a branch**:
   ```bash
   git checkout -b feat/your-feature-name # or fix/your-fix-name, chore/your-chore-name, docs/your-docs-name, etc.
   ```

2. **Make your changes** following the guidelines

3. **Test your changes** by running the application. See [Previewing Builds](#previewing-builds) for more information.

4. **Check code quality (if applicable)**:
   ```bash
   # Format code
   pnpm lint

   # Run type checker
   pnpm tsc
   ```

   See [Checking Code Quality](#checking-code-quality) for more information.

5. **Commit your changes**. See [Committing](#committing) for more information.

6. **Push and create a pull request**. See [Pushing to the Repositories](#pushing-to-the-repositories) and [Creating Pull Requests](#creating-pull-requests) for more information.

## Developing

### Running the Development Environment

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

> [!TIP]
> If the network is properly set up (see [Preparing the Network](#preparing-the-network) for more details), you can access the development environment in your browsers using the URL `http://dev.thal.9aia.com:3000`. This allows seamless collaboration within the shared network during your codeshare session.

### Stopping the Development Environment

To stop the development environment, you need to run the following command:

```bash
pnpm run down
```

This will stop the Stripe and codeshare containers running in the background.

### Writing Code

- Use meaningful variable and function names
- Avoid redudant comments with the code itself
- Keep functions small and focused
- Use types

> [!IMPORTANT]
> Don't forget to run `pnpm cf-typegen` to generate the Cloudflare types.

### Checking Code Quality

For keeping the code organized, we use the following tools:

- [Eslint](https://eslint.org/): Used to help us with the code formatting and linting. It automatically fix the linting issues when you save the files. You can also run it manually with `pnpm lint` to check the issues or `pnpm lint:fix` to fix the issues.
- [Vue Tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc): Used to help us with the type safety. It's automatically run before the release. You can also run it manually with `pnpm tsc`.

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

> [!IMPORTANT]
> Remember to set the environment by opening Command Palette and selecting `Rest Client: Switch Environment`.

### Managing the Local Containers

To execute commands in the local containers, you can run the following command:

```bash
pnpm stripe {command} # for the Stripe container
pnpm cs {command} # for the codeshare container
```

### Previewing Builds

Preview it locally, run:

```bash
pnpm run build && pnpm run preview # for previewing development
pnpm run build:preview && pnpm run preview # for previewing preview
pnpm run build:prod && pnpm run preview # for previewing production
```

### Getting AI Assistance

We can use AI code tools to get assistance for generating code, refactoring, debugging, testing, and documentation.

Examples: [Copilot](https://copilot.github.com/) (IDE extension), [Cursor](https://www.cursor.com/) (IDE fork), [Gemini CLI](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/) (terminal tool)

### Delegating Tasks to AI Software Engineers

We can use AI software engineers to delegate tasks across the project to an autonomous agent in the cloud. These tools can handle complex, multi-step tasks and integrate with your workflow.

Examples: [Devin](https://devin.ai/), [Codex](https://openai.com/codex/)

## Designing

Our design process is generally intuitive, but we can use different tools to design the application. We also search for inspirations in different sources, such as [Dribbble](https://dribbble.com/), [Behance](https://www.behance.net/) and/or [Pinterest](https://www.pinterest.com/). Also, we can be inspired by existing projects.

We don't use an external full-fledged design system component library, but instead we have a set of technologies that we use to help us with the styling, accessibility, functionality, and other design considerations.

- [DaisyUI](https://daisyui.com/) (for styling)
- [ArkUI](https://ark-ui.com/) (for accessibility, and other design considerations)
- [Iconify](https://icon-sets.iconify.design/) (for icons)
- [Tailwind CSS](https://tailwindcss.com/) and a custom configuration (for design tokens, styling, and other design considerations)

You can find our custom UI components in the `./app/components` folder.

### Designing the UI

We can use [Stitch](https://stitch.withgoogle.com/) to design the UI.

> [!NOTE]
> Stitch is not a perfect tool, so you may need to change some things to make it better. That's why we use it as a reference, but not as the final design.

## Managing the Content

> [!TIP]
> You can edit the content directly in the `./app/content` folder or the translations in the `./app/locales` folder via GitHub website, but it's recommended to edit the content locally or in a codeshare.

To manage the content of the application, we use a Git-based CMS called [Nuxt Content](https://content.nuxt.dev/) and an AI-powered framework called [Psitta](https://github.com/9aia/psitta). You can find some of the content in `./app/content` folder and the rest in `./app/locales` folder.

> [!NOTE]
> Psitta is not a perfect tool, so you may need to adjust the generated content manually.

### Translating the Content

To translate the content, you need to run the following command:

```bash
pnpm run i18n translate
```

### Cleaning Up the Content

To clean up Psitta unused messages, you need to run the following command:

```bash
pnpm run i18n cleanup
```

### Adjusting Generated Content

To adjust the generated content, you need to run the following command:

```bash
pnpm run i18n adjust <prompt>
# For example: pnpm run i18n adjust "Make the translation a little bit more formal"
```

## Streamlining Operations

### Managing the Infrastructure

We use [Cloudflare](https://www.cloudflare.com/) to manage the infrastructure.

### Deploying Preview without Releasing

> [!CAUTION]
> This is not the proper way to deploy the application, it's just here for documentation purposes. See [Releasing](#releasing) for the right way.

To deploy a version without creating a release, use the following command:

```bash
pnpm run build && pnpm run deploy # for deploying development
pnpm run build:preview && pnpm run deploy:preview # for deploying preview
pnpm run build:prod && pnpm run deploy:prod # for deploying production
```

### Releasing

> [!WARNING]
> Before releasing, it's recommended to preview locally the application and to test it to ensure everything works as expected.

1. **Update the Changelog**
   - Manually update the changelog sections following the standard described here: [Keep a Changelog](https://www.npmjs.com/package/@release-it/keep-a-changelog).
   - Do **not** specify the next version in the changelog. Leave it as `## [Unreleased]`, which will be automatically updated with the version and release date. This also applies to the README file.
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

## Marketing

// TODO: Add marketing documentation

## Testing and Assuring Quality

// TODO: Add testing and assuring quality documentation

## Useful Links

- [Iconify Icons](https://icon-sets.iconify.design/material-symbols/?keyword=material)

## Getting Help

> [!WARNING]
> For human-human communication, please prioritize asynchronous communication over real-time communication when possible.

### Getting Asynchronous Help

If you have questions or need help, we recommend you to follow these steps in order:

1. Read through this contributing guide.
2. Check the existing documentation in the `docs/` folder.
3. Refer to the official documentation for any relevant technologies.
4. Examine existing code, issues, and discussions for similar problems.
5. If you still need help, open a new issue for bugs or feature requests, or use a discussion for general questions.

### Getting Real-Time Help

For immediate assistance, we encourage you to use both community support and AI.

* **Community**: We have a [Discord server](https://discord.gg/RsYaUn3zQa) where you can get real-time help from our community members and core team if they are available.
* **AI Assistants:** We encourage you to leverage general-purpose AI Assistant, such as [Gemini](https://gemini.google.com/) or [ChatGPT](https://chatgpt.com/). They provide high-level, conversational help, such as explaining complex concepts, brainstorming solutions, and more.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Thal!
