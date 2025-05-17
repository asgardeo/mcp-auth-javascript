# Contributing to Asgardeo MCP Node.js SDKs

This guide walks you through setting up the development environment and other important information for contributing to
Asgardeo MCP Node.js SDKs.

We welcome contributions of all kinds, from bug fixes and documentation improvements to new features.

## Table of Contents

- [Prerequisite Software](#prerequisite-software)
- [Development Tools](#development-tools)
- [Setting up the Source Code](#setting-up-the-source-code)
- [Setting up the Development Environment](#setting-up-the-development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Making Changes](#making-changes)
  - [Building Packages](#building-packages)
  - [Linting Code](#linting-code)
  - [Running Tests](#running-tests)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Commit Message Header](#commit-message-header)
    - [Type](#type)
    - [Scope](#scope)
    - [Summary](#summary)
  - [Commit Message Body](#commit-message-body)
  - [Commit Message Footer](#commit-message-footer)
  - [Revert Commits](#revert-commits)
- [Submitting Changes (Pull Request Process)](#submitting-changes-pull-request-process)
- [Reporting Bugs](#reporting-bugs)
  - [Security Vulnerabilities](#security-vulnerabilities)
- [Suggesting Enhancements](#suggesting-enhancements)
- [License](#license)

## Prerequisite Software

To build and write code, make sure you have the following set of tools on your local environment:

- [Git](https://git-scm.com/downloads) - Open source distributed version control system.
- [Node.js](https://nodejs.org/en/download/) - JavaScript runtime. (`v16.x or higher`)
- [pnpm](https://pnpm.io/) - Alternate npm client for faster package installs. (`v8.x or higher`)

## Development Tools

While not required, the following tools are recommended for a better development experience:

### ESLint Plugin

Static code analysis tool for identifying problematic patterns found in JavaScript/TypeScript code.

- [Install for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Install for VS Web Storm](https://www.jetbrains.com/help/webstorm/eslint.html)

### Code Spell Checker

A basic spell checker that works well with code and documents.

- [Install for VS Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

### JSON Sort Order

Sorts JSON objects in alphabetical order.

- [Install for VS Code](https://marketplace.visualstudio.com/items?itemName=msyesyan.json-sorter)

## Setting up the Source Code

1. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the repository.
2. Clone your fork to the local machine.

Replace `<github username>` with your own username.

```shell
git clone https://github.com/<github username>/asgardeo-mcp-node.git
```

3. Set the original repo as the upstream remote.

```shell
git remote add upstream https://github.com/brionmario/asgardeo-mcp-node.git
```

## Setting up the Development Environment

1. Install dependencies.

```bash
pnpm install
```

2. Build the project.

```bash
pnpm build
```

## Project Structure

The asgardeo-mcp-node repository is a monorepo containing the following key packages located in the `packages/`
directory:

- `packages/mcp-node` (`@asgardeo/mcp-node`): Core Node.js utilities for MCP.
- `packages/mcp-express` (`@asgardeo/mcp-express`): Express middleware for MCP, likely dependent on mcp-node.

Shared configurations (like ESLint, Prettier, TypeScript) are typically managed at the root level.

## Development Workflow

### Branching Strategy

- **main**: This branch contains the latest stable release. Direct pushes to main are restricted.
- **Feature Branches**: Create new branches from main for new features (e.g., `feat/your-feature-name`).
- **Bugfix Branches**: Create new branches from main for bug fixes (e.g., `fix/issue-number-description`).

### Making Changes

1. Ensure your local `main` branch is up-to-date with the upstream repository.
2. Create a new branch from `main` for your changes.
3. Make your code changes in the relevant package(s) within the `packages/` directory.
4. Add or update tests as appropriate.
5. Ensure all tests and linting checks pass.

### Building Packages

You can build all packages or a specific package:

**Build all packages:**

```bash
pnpm run build
# or if you have a specific script for all packages
# pnpm run build:all
```

**Build a specific package:** Use the `--filter` flag with pnpm. Replace `<package-name>` with the actual package name
(e.g., `@asgardeo/mcp-express`).

```bash
pnpm --filter <package-name> run build

# Example for mcp-express:
pnpm --filter @asgardeo/mcp-express run build
```

### Linting Code

Ensure your code adheres to the project's linting standards:

**Lint all packages:**

```bash
pnpm run lint
# or
# pnpm run lint:all
```

**Lint a specific package:**

```bash
pnpm --filter <package-name> run lint

# Example for mcp-node:
pnpm --filter @asgardeo/mcp-node run lint
```

You can also run lint fix scripts if available (e.g., `pnpm run lint:fix`).

### Running Tests

Ensure all existing tests pass and add new tests for your changes:

**Test all packages:**

```bash
pnpm run test
# or
# pnpm run test:all
```

**Test a specific package:**

```bash
pnpm --filter <package-name> run test

# Example for mcp-express:
pnpm --filter @asgardeo/mcp-express run test
```

## Commit Message Guidelines

_This specification is inspired by and supersedes the [AngularJS commit message format][commit-message-format]._

We have very precise rules over how our Git commit messages must be formatted. This format leads to **easier to read
commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-message-header) format.

The `body` is mandatory for all commits except for those of type "docs". When the body is present it must be at least 20
characters long and must conform to the [Commit Message Body](#commit-message-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-message-footer) format describes what the footer is used
for and the structure it must have.

### Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: mcp-node|mcp-express
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|chore|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

#### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **chore**: Housekeeping tasks that doesn't require to be highlighted in the changelog
- **test**: Adding missing tests or correcting existing tests

#### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated
from commit messages).

The following is the list of supported scopes:

- `mcp-node` - Changes to the `@asgardeo/mcp-node` package.
- `mcp-express` - Changes to the `@asgardeo/mcp-express` package.
- `workspace` - Changes to the workspace.
- `sample-app` - Changes to the sample app.

There are currently a few exceptions to the "use package name" rule:

- `packaging`: used for changes that change the npm package layout in all of our packages, e.g. public path changes,
  package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.
- `changelog`: used for updating the release notes in CHANGELOG.md
- `dev-infra`: used for dev-infra related changes within the directories like /scripts.
- `docs-infra`: used for docs page changes.
- none/empty string: useful for `test` and `refactor` changes that are done across all packages (e.g.
  `test: add missing unit tests`) and for docs changes that are not related to a specific package (e.g.
  `docs: fix typo in example`).

#### Summary

Use the summary field to provide a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes".
- Don't capitalize the first letter.
- No dot (.) at the end.

### Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are
making the change. You can include a comparison of the previous behavior with the new behavior in order to illustrate
the impact of the change.

### Commit Message Footer

The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub
issues, Jira tickets, and other PRs that this commit closes or is related to. For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a
blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated,
a blank line, and a detailed description of the deprecation that also mentions the recommended update path.

### Revert Commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

- Information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`.
- A clear description of the reason for reverting the commit message.

## Submitting Changes (Pull Request Process)

1. Ensure all development steps (building, linting, testing) are complete and passing.
2. Commit your changes using the Conventional Commits format.
3. Push your feature/bugfix branch to your forked repository on GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Go to the original `brionmario/asgardeo-mcp-node` repository on GitHub and open a new Pull Request from your forked
   branch to the `main` branch of the upstream repository.
5. Provide a clear title and a detailed description for your Pull Request:
   - Explain the "why" and "what" of your changes.
   - Reference any related GitHub issues (e.g., "Closes #123").
   - Include steps for testing if applicable.
6. Your Pull Request will be reviewed by maintainers. Be prepared to discuss your changes and make adjustments based on
   feedback.
7. Once approved and all checks pass, your PR will be merged.

## Reporting Bugs

If you encounter a bug, please help us by reporting it!

1. **Search existing issues**: Before creating a new issue, please check if the bug has already been reported on the
   GitHub Issues page.
2. **Create a new issue**: If it's a new bug, please provide a detailed report including:
   - A clear and descriptive title.
   - Steps to reproduce the bug.
   - What you expected to happen.
   - What actually happened (including any error messages or stack traces).
   - Your environment (Node.js version, package versions, OS, etc.).

### Security Vulnerabilities

Do not report security vulnerabilities through public GitHub issues. Please report security vulnerabilities directly to
security@wso2.com. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines.

## Suggesting Enhancements

We welcome suggestions for new features or improvements!

1. **Search existing issues/discussions**: Check if your idea has already been discussed.
2. **Create a new issue**: Provide a clear description of the proposed enhancement, why it would be beneficial, and any
   potential implementation details.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the
project itself.

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit
