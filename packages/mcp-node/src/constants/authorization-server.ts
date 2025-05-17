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

/**
 * The well-known path for OAuth 2.0 Authorization Server Metadata.
 * @see https://datatracker.ietf.org/doc/html/rfc8414#section-3
 */
export const AUTHORIZATION_SERVER_METADATA_URL: string = '/.well-known/oauth-authorization-server';

/**
 * The well-known path for OAuth 2.0 Resource Server Metadata.
 * @see https://datatracker.ietf.org/doc/html/rfc9728#name-obtaining-protected-resourc
 */
export const PROTECTED_RESOURCE_URL: string = '/.well-known/oauth-protected-resource';
