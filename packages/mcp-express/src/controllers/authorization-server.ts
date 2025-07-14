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

import {
  AuthorizationServerMetadata,
  AuthorizationServerMetadataOptions,
  generateAuthorizationServerMetadata,
} from '@pavindulakshan/mcp-node';
import cors from 'cors';
import express, {RequestHandler, Request, Response, Router} from 'express';

/**
 * Creates an Express request handler that serves OAuth 2.0 Authorization Server Metadata.
 * This handler implements the OAuth 2.0 Authorization Server Metadata endpoint as defined in RFC 8414.
 * The endpoint provides configuration information about the authorization server, including its
 * endpoints, supported response types, and other capabilities.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8414 RFC 8414}
 *
 * @param options - Configuration options for the authorization server metadata.
 *                 These options determine the content of the metadata response,
 *                 including URLs, supported scopes, authentication methods, etc.
 *
 * @returns An Express RequestHandler that:
 *          - Enables CORS for cross-origin requests
 *          - Returns authorization server metadata as JSON on GET requests
 *          - Handles errors and returns appropriate HTTP status codes
 *
 * @throws Will return a 500 status code if metadata generation fails
 *
 * @example
 * ```typescript
 * const options: AuthorizationServerMetadataOptions = {
 *   issuer: 'https://auth.example.com',
 *   supportedScopes: ['openid', 'profile', 'email'],
 *   supportedAuthMethods: ['client_secret_basic']
 * };
 * app.use('/.well-known/oauth-authorization-server', getAuthorizationServerMetadata(options));
 * ```
 */
export function getAuthorizationServerMetadata(options: AuthorizationServerMetadataOptions): RequestHandler {
  const router: Router = express.Router();

  router.use(cors());

  router.get('/', (_req: Request, res: Response) => {
    try {
      const metadata: AuthorizationServerMetadata = generateAuthorizationServerMetadata(options);
      res.status(200).json(metadata);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  });

  return router;
}
