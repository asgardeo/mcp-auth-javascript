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

import {AUTHORIZATION_SERVER_METADATA_URL, PROTECTED_RESOURCE_URL, McpAuthOptions} from '@asgardeo/mcp-node';
import express from 'express';
import {getAuthorizationServerMetadata} from '../controllers/authorization-server';
import {getProtectedResourceMetadata} from '../controllers/protected-resource';

export default function AuthRouter(options: McpAuthOptions): express.Router {
  const router: express.Router = express.Router();
  const {baseUrl, issuer} = options;
  if (!baseUrl) {
    throw new Error('baseUrl must be provided');
  }

  router.use(
    PROTECTED_RESOURCE_URL,
    getProtectedResourceMetadata({
      authorizationServers: [issuer],
      resource: 'https://api.example.com',
    }),
  );

  router.use(
    AUTHORIZATION_SERVER_METADATA_URL,
    getAuthorizationServerMetadata({
      baseUrl,
    }),
  );

  return router;
}
