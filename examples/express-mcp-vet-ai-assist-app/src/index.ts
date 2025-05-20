/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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

interface TransportMap {
  [sessionId: string]: {
    lastAccess: number;
    transport: StreamableHTTPServerTransport;
  };
}

const transports: TransportMap = {};
const SESSION_TIMEOUT_MS: number = 30 * 60 * 1000;

const isSessionExpired = (lastAccessTime: number): boolean => Date.now() - lastAccessTime > SESSION_TIMEOUT_MS;

app.post(
  '/mcp',
  protectedRoute({
    baseUrl: process.env.BASE_URL as string,
  }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId: string | undefined = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        if (isSessionExpired(transports[sessionId].lastAccess)) {
          // eslint-disable-next-line no-console
          console.log(`Session expired: ${sessionId}`);
          transports[sessionId].transport.close();
          delete transports[sessionId];

          res.status(401).json({
            error: {
              code: -32000,
              message: 'Session expired',
            },
            id: null,
            jsonrpc: '2.0',
          });
          return;
        }

        transport = transports[sessionId].transport;
        transports[sessionId].lastAccess = Date.now();
      } else if (!sessionId && isInitializeRequest(req.body)) {
        let bearerToken: string | undefined;
        const authHeader: string | undefined = req.headers.authorization as string | undefined;
        if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
          bearerToken = authHeader.substring(7);
          // eslint-disable-next-line no-console
          console.log(`Bearer token captured for new session.`);
        } else {
          // eslint-disable-next-line no-console
          console.warn('MCP session initialized: No Bearer token found in Authorization header.');
        }
        transport = new StreamableHTTPServerTransport({
          onsessioninitialized: (newSessionId: string): void => {
            transports[newSessionId] = {
              lastAccess: Date.now(),
              transport,
            };
            // eslint-disable-next-line no-console
            console.log(`Session initialized: ${newSessionId}`);
          },
          sessionIdGenerator: (): string => randomUUID(),
        });

        transport.onclose = (): void => {
          if (transport.sessionId) {
            // eslint-disable-next-line no-console
            console.log(`Session closed: ${transport.sessionId}`);
            delete transports[transport.sessionId];
          }
        };

        const server: McpServer = new McpServer({
          name: 'example-server',
          version: '1.0.0',
        });

        server.tool(
          'get_pet_vaccination_info',
          'Retrieves the vaccination history and upcoming vaccination dates for a specific pet. Requires user authentication and explicit consent via an authorization token.',
          {
            petId: z.string().describe('The unique identifier for the pet.'),
          },
          async ({petId}: {petId: string}) => {
            try {
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
            } catch (error) {
              const errorMessage: string = error instanceof Error ? error.message : String(error);
              throw new Error(`Failed to retrieve vaccination information: ${errorMessage}`);
            }
          },
        );

        server.tool(
          'book_vet_appointment',
          'Books a new veterinary appointment for a specific pet. Requires user authentication and explicit consent via an authorization token.',
          {
            date: z.string().describe('Desired date for the appointment (e.g., YYYY-MM-DD).'),
            petId: z.string().describe('The unique identifier for the pet.'),
            reason: z.string().describe('The reason for the vet visit.'),
            time: z.string().describe('Desired time for the appointment (e.g., HH:MM AM/PM).'),
          },
          async ({date, petId, reason, time}: {date: string; petId: string; reason: string; time: string}) => {
            try {
              return {
                content: [
                  {
                    text: `Booked vet appointment for pet ID: ${petId} on ${date} at ${time} for: ${reason}. Token was ${
                      bearerToken ? 'present' : 'absent'
                    }.`,
                    type: 'text',
                  },
                ],
              };
            } catch (error) {
              const errorMessage: string = error instanceof Error ? error.message : String(error);
              throw new Error(`Failed to book appointment: ${errorMessage}`);
            }
          },
        );

        try {
          await server.connect(transport);
          // eslint-disable-next-line no-console
          console.log('Server connected to transport');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error connecting server to transport: ${error}`);
          res.status(500).json({
            error: {
              code: -32000,
              message: 'Internal server error: Failed to connect to MCP server',
            },
            id: null,
            jsonrpc: '2.0',
          });
          return;
        }
      } else {
        let message: string = 'Bad Request: No valid session ID provided for existing session.';
        if (!isInitializeRequest(req.body)) {
          message = 'Bad Request: Not an initialization request and no session ID found.';
        }
        res.status(400).json({
          error: {
            code: -32000,
            message,
          },
          id: req.body?.id || null,
          jsonrpc: '2.0',
        });
        return;
      }

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      const requestId: string | number | null | undefined =
        typeof req.body === 'object' && req.body !== null && 'id' in req.body ? req.body.id : null;
      res.status(500).json({
        error: {
          code: -32000,
          message: 'Internal server error',
        },
        id: requestId,
        jsonrpc: '2.0',
      });
    }
  },
);

const handleSessionRequest = async (expressReq: Request, expressRes: Response): Promise<void> => {
  try {
    const sessionId: string | undefined = expressReq.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      expressRes.status(400).send('Invalid or missing session ID');
      return;
    }

    if (isSessionExpired(transports[sessionId].lastAccess)) {
      // eslint-disable-next-line no-console
      console.log(`Session expired: ${sessionId}`);
      transports[sessionId].transport.close();
      delete transports[sessionId];
      expressRes.status(401).send('Session expired');
      return;
    }

    transports[sessionId].lastAccess = Date.now();

    const {transport}: {transport: StreamableHTTPServerTransport} = transports[sessionId];
    await transport.handleRequest(expressReq, expressRes);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error handling session request: ${error}`);
    expressRes.status(500).send('Internal server error');
  }
};

app.get('/mcp', handleSessionRequest);
app.delete('/mcp', handleSessionRequest);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`MCP server running on port ${PORT}`);
});
