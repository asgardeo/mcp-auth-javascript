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

import {McpAuthOptions, PROTECTED_RESOURCE_URL, validateToken} from '@asgardeo/mcp-node';
import {NextFunction, Request, Response} from 'express';

export default function bearerAuthMiddleware(options: McpAuthOptions) {
  return async function protectedMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader) {
      res.setHeader(
        'WWW-Authenticate',
        `Bearer resource_metadata="${req.protocol}://${req.get('host')}${PROTECTED_RESOURCE_URL}"`,
      );
      res.status(401).json({
        error: 'unauthorized',
        error_description: 'Missing authorization token',
      });
      return;
    }

    const parts: string[] = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        error: 'invalid_token',
        error_description: 'Authorization header must be in format: Bearer [token]',
      });
      return;
    }

    const token: string = parts[1];

    const baseUrl: string | undefined = options?.baseUrl;
    const issuer: string | undefined = options?.issuer;
    const endpoints:
      | {
          jwks?: string | undefined;
        }
      | undefined = options?.endpoints;

    const TOKEN_VALIDATION_CONFIG: {
      jwksUri: string;
      options: {
        audience?: string;
        clockTolerance: number;
        issuer: string;
      };
    } = {
      jwksUri: endpoints?.jwks ?? `${baseUrl}/oauth2/jwks}`,
      options: {
        audience: options?.audience,
        clockTolerance: 60,
        issuer,
      },
    };

    try {
      await validateToken(token, TOKEN_VALIDATION_CONFIG.jwksUri, TOKEN_VALIDATION_CONFIG.options);
      next();
    } catch (error: any) {
      res.status(401).json({
        error: 'invalid_token',
        error_description: error.message || 'Invalid or expired token',
      });
    }
  };
}
