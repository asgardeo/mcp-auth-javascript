# @asgardeo/mcp-express

[![npm version](https://img.shields.io/npm/v/@asgardeo/mcp-express.svg?style=flat-square)](https://www.npmjs.com/package/@asgardeo/mcp-express)
[![npm downloads](https://img.shields.io/npm/dm/@asgardeo/mcp-express.svg?style=flat-square)](https://www.npmjs.com/package/@asgardeo/mcp-express)

Express middleware for enforcing Model Context Protocol (MCP) authorization using Asgardeo.

## Overview

This package provides Express middleware that implements Model Context Protocol (MCP) based authorization for Express.js
applications. It integrates with Asgardeo for authentication and authorization services.

This package is part of the [Asgardeo MCP Node.js SDKs monorepo](https://github.com/asgardeo/asgardeo-mcp-node#readme).
For overall project information, contribution guidelines, and details on other related packages, please refer to the
main repository.

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

### Basic Setup

```typescript
import express from 'express';
import {McpAuth, protectedRoute} from '@asgardeo/mcp-express';

const app = express();

// Initialize MCP authentication middleware with baseUrl
app.use(
  McpAuth({
    baseUrl: process.env.BASE_URL as string,
  }),
);

// Protect your MCP endpoint
app.post(
  '/mcp',
  protectedRoute({
    baseUrl: process.env.BASE_URL as string,
  }),
  async (req, res) => {
    // Your MCP handling logic here
  },
);
```

### API Reference

#### McpAuth(options)

Initializes the MCP authentication server middleware with the given configuration.

```typescript
import {McpAuth} from '@asgardeo/mcp-express';

app.use(McpAuth({baseUrl: 'https://auth.example.com'}));
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
import {randomUUID} from 'node:crypto';
import {McpAuth, protectedRoute} from '@asgardeo/mcp-express';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp';
import {isInitializeRequest} from '@modelcontextprotocol/sdk/types';
import {config} from 'dotenv';
import express, {Express, Request, Response} from 'express';
import {z} from 'zod';

config();

const app: Express = express();
app.use(express.json());
app.use(
  McpAuth({
    baseUrl: process.env.BASE_URL as string,
  }),
);

// Session management
interface TransportMap {
  [sessionId: string]: {
    lastAccess: number;
    transport: StreamableHTTPServerTransport;
  };
}

const transports: TransportMap = {};
const SESSION_TIMEOUT_MS: number = 30 * 60 * 1000;

const isSessionExpired = (lastAccessTime: number): boolean => Date.now() - lastAccessTime > SESSION_TIMEOUT_MS;

// MCP endpoint with authentication
app.post(
  '/mcp',
  protectedRoute({
    baseUrl: process.env.BASE_URL as string,
  }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId: string | undefined = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      // Handle existing session or create new one
      if (sessionId && transports[sessionId]) {
        // Session management code...
        transport = transports[sessionId].transport;
        transports[sessionId].lastAccess = Date.now();
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // Extract bearer token if present
        let bearerToken: string | undefined;
        const authHeader: string | undefined = req.headers.authorization as string | undefined;
        if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
          bearerToken = authHeader.substring(7);
          console.log(`Bearer token captured for new session.`);
        }

        // Create MCP server and configure tools
        transport = new StreamableHTTPServerTransport({
          // Transport configuration...
        });

        const server: McpServer = new McpServer({
          name: 'example-server',
          version: '1.0.0',
        });

        // Define MCP tools
        server.tool(
          'get_pet_vaccination_info',
          'Retrieves the vaccination history for a specific pet.',
          {
            petId: z.string().describe('The unique identifier for the pet.'),
          },
          async ({petId}) => {
            // Tool implementation using bearer token
            return {
              content: [
                {
                  text: `Retrieved vaccination info for pet ID: ${petId}. Token was ${
                    bearerToken ? 'present' : 'absent'
                  }.`,
                  type: 'text',
                },
              ],
            };
          },
        );

        await server.connect(transport);
      } else {
        // Handle invalid requests
        res.status(400).json({
          error: {
            code: -32000,
            message: 'Bad Request',
          },
          id: req.body?.id || null,
          jsonrpc: '2.0',
        });
        return;
      }

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      // Error handling
    }
  },
);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, (): void => {
  console.log(`MCP server running on port ${PORT}`);
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
