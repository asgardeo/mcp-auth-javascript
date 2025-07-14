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

import {McpAuthOptions} from '@pavindulakshan/mcp-node';
import {Router, RequestHandler} from 'express';
import bearerAuthMiddleware from './middlewares/bearerAuthMiddleware';
import AuthRouter from './routes/auth';

export class McpAuthServer {
  private options: McpAuthOptions;

  private routerInstance: Router;

  constructor(options: McpAuthOptions) {
    if (!options.baseUrl) {
      throw new Error('baseUrl must be provided');
    }
    this.options = options;
    this.routerInstance = AuthRouter(this.options);
  }

  public router(): Router {
    return this.routerInstance;
  }

  public protect(): RequestHandler {
    return bearerAuthMiddleware(this.options);
  }
}
