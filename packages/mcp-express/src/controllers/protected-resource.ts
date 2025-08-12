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
  ProtectedResourceMetadata,
  ProtectedResourceMetadataOptions,
  generateProtectedResourceMetadata,
} from '@asgardeo/mcp-node';
import cors from 'cors';
import express, {RequestHandler, Request, Response, Router} from 'express';

/**
 * Creates an Express request handler that serves OAuth 2.0 Protected Resource Metadata.
 * This handler implements the OAuth 2.0 Protected Resource Metadata endpoint as defined in the specification.
 * The endpoint provides configuration information about the protected resource.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/draft-ietf-oauth-resource-metadata}
 *
 * @param options - Configuration options for the protected resource metadata.
 *                These options determine the content of the metadata response,
 *                including resource URL, trusted authorization servers, supported scopes, etc.
 *
 * @returns An Express RequestHandler that:
 *          - Enables CORS for cross-origin requests
 *          - Returns protected resource metadata as JSON on GET requests
 *          - Handles errors and returns appropriate HTTP status codes
 *
 * @throws Will return a 500 status code if metadata generation fails
 *
 * @example
 * ```typescript
 * const options: ProtectedResourceMetadataOptions = {
 *   resourceUrl: 'https://resource.example.com',
 *   authorizationServers: ['https://as1.example.com', 'https://as2.example.net'],
 *   supportedScopes: ['profile', 'email']
 * };
 * app.use('/.well-known/protected-resource', getProtectedResourceMetadata(options));
 * ```
 */
export function getProtectedResourceMetadata(options: ProtectedResourceMetadataOptions): RequestHandler {
  const router: Router = express.Router();

  router.use(cors());

  router.get('/', (_req: Request, res: Response) => {
    try {
      const metadata: ProtectedResourceMetadata = generateProtectedResourceMetadata(options);
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
