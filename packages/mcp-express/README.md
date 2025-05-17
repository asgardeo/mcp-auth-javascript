# @asgardeo/mcp-express

[![npm version](https://img.shields.io/npm/v/@asgardeo/mcp-express.svg?style=flat-square)](https://www.npmjs.com/package/@asgardeo/mcp-express)
[![npm downloads](https://img.shields.io/npm/dm/@asgardeo/mcp-express.svg?style=flat-square)](https://www.npmjs.com/package/@asgardeo/mcp-express)

Express middleware for enforcing Model Context Protocol (MCP) authorization using Asgardeo.

## Overview

This package provides Express middleware that implements Model Context Protocol (MCP) based authorization for Express.js
applications. It integrates with Asgardeo for authentication and authorization services.

This package is part of the
[Asgardeo MCP Node.js SDKs monorepo](https://github.com/brionmario/asgardeo-mcp-node#readme). For overall project
information, contribution guidelines, and details on other related packages, please refer to the main repository.

## Installation

```bash
npm install @asgardeo/mcp-express
# or
yarn add @asgardeo/mcp-express
# or
pnpm add @asgardeo/mcp-express
```

## Features

- Easy-to-use Express middleware
- Protected route handling
- Automatic metadata endpoint setup
- Built-in CORS support
- Seamless integration with Asgardeo

## Usage

```typescript
import express from 'express';
import {McpAuthServer, protectedRoute} from '@asgardeo/mcp-express';

const app = express();

// Initialize MCP authentication server with baseUrl
app.use(
  McpAuthServer({
    baseUrl: process.env.BASE_URL as string,
  }),
);

// Public routes
app.get('/api/public', (req, res) => {
  res.json({message: 'This is a public endpoint'});
});

// Protected routes
app.use('/api/protected', protectedRoute, (req, res) => {
  res.json({message: 'This is a protected endpoint'});
});
```

### API Reference

#### McpAuthServer(options)

Initializes the MCP authentication server middleware with the given configuration.

```typescript
import {McpAuthServer} from '@asgardeo/mcp-express';

app.use(McpAuthServer({baseUrl: 'https://auth.example.com'}));
```

#### protectedRoute

Middleware to protect routes that require authentication.

```typescript
import {protectedRoute} from '@asgardeo/mcp-express';

app.use('/api/protected', protectedRoute, protectedRoutes);
```

### Configuration

The middleware can be configured with the following option:

```typescript
interface McpAuthOptions {
  /** Base URL of the authorization server */
  baseUrl: string;
}
```

## Example

Here's a complete example of setting up an Express server with MCP authentication:

```typescript
import express from 'express';
import {McpAuthServer, protectedRoute} from '@asgardeo/mcp-express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize MCP authentication
app.use(McpAuthServer());

// Public routes
app.use('/api', publicRoutes);

// Protected routes with MCP authentication
app.use('/api/protected', protectedRoute, protectedRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: 'Something broke!'});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### Prerequisites

- Node.js 16.x or later
- pnpm 8.x or later

### Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## License

Apache-2.0 - see the [LICENSE](LICENSE) file for details.
