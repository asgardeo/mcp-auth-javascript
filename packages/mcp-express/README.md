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

## Usage

### Basic Setup

```typescript
import express from 'express';
import {McpAuthServer} from '@asgardeo/mcp-express';

const app = express();

// Initialize McpAuthServer with baseUrl
const mcpAuthServer = new McpAuthServer({
  baseUrl: process.env.BASE_URL as string,
});

app.use(express.json());
app.use(mcpAuthServer.router());

// Protect your MCP endpoint
app.post('/mcp', mcpAuthServer.protect(), async (req, res) => {
  // Your MCP handling logic here
});
```

### API Reference

#### McpAuthServer(options)

Creates a new instance of the MCP authentication server with the given configuration.

```typescript
import {McpAuthServer} from '@asgardeo/mcp-express';

const mcpAuthServer = new McpAuthServer({baseUrl: 'https://auth.example.com'});
```

#### mcpAuthServer.router()

Returns an Express router that sets up the necessary endpoints for MCP authentication.

```typescript
app.use(mcpAuthServer.router());
```

#### mcpAuthServer.protect()

Returns middleware that protects routes requiring authentication. This middleware should be applied before your route
handler.

```typescript
app.post('/api/protected', mcpAuthServer.protect(), async (req, res) => {
  // Your protected route logic here
});
```

### Configuration

The server can be configured with the following option:

```typescript
interface McpAuthServerOptions {
  /** Base URL of the authorization server */
  baseUrl: string;
}
```

## Example

Here's a complete example of setting up an Express server with MCP authentication:

```typescript
import {randomUUID} from 'node:crypto';
import {McpAuthServer} from '@asgardeo/mcp-express';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp';
import {isInitializeRequest} from '@modelcontextprotocol/sdk/types';
import {config} from 'dotenv';
import express, {Express, Request, Response} from 'express';
import {z} from 'zod';

config();

const app: Express = express();

// Initialize McpAuthServer
const mcpAuthServer = new McpAuthServer({
  baseUrl: process.env.BASE_URL as string,
});

app.use(express.json());
app.use(mcpAuthServer.router());

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
  mcpAuthServer.protect(),
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
  }),
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
