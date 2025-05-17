/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import {ProtectedResourceMetadata, ProtectedResourceMetadataOptions} from '../models/authorization-server';

/**
 * Generates OAuth 2.0 Protected Resource Metadata according to the specification.
 * @see https://datatracker.ietf.org/doc/html/draft-ietf-oauth-resource-metadata
 *
 * @param options Configuration options for the protected resource metadata
 * @returns Protected resource metadata object
 */
export default function generateProtectedResourceMetadata(
  options: ProtectedResourceMetadataOptions,
): ProtectedResourceMetadata {
  // Disabling the sort-keys rule to maintain the order of the keys as per the RFC.
  /* eslint-disable sort-keys */
  const metadata: ProtectedResourceMetadata = {
    resource: options.resource,
    authorization_servers: options.authorizationServers,
    bearer_methods_supported: options.bearerMethodsSupported || ['header'],
  };
  /* eslint-enable sort-keys */

  if (options.supportedScopes && options.supportedScopes.length > 0) {
    metadata.scopes_supported = options.supportedScopes;
  }

  if (options.resourceDocumentation) {
    metadata.resource_documentation = options.resourceDocumentation;
  }

  return metadata;
}
