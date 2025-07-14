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

import {AuthorizationServerMetadata, AuthorizationServerMetadataOptions} from '../models/authorization-server';

/**
 * Generates OAuth 2.0 Authorization Server Metadata according to RFC 8414
 * @see https://datatracker.ietf.org/doc/html/rfc8414#section-3.2
 *
 * @param options Configuration options for the authorization server metadata
 * @returns Authorization server metadata object
 */
export default function generateAuthorizationServerMetadata(
  options: AuthorizationServerMetadataOptions,
): AuthorizationServerMetadata {
  const {issuer, endpoints} = options;

  const metadata: AuthorizationServerMetadata = {
    authorization_endpoint: `${options.baseUrl}${endpoints?.authorize ?? '/oauth2/authorize'}`,
    issuer: `${issuer}`,
    response_types_supported: ['code'],
    token_endpoint: `${options.baseUrl}${endpoints?.token ?? '/oauth2/token'}`,
  };

  // TODO: Check this further.
  // if (options.scopesSupported && options.scopesSupported.length > 0) {
  //   metadata.scopes_supported = options.scopesSupported;
  // }

  // if (options.supportedAuthMethods && options.supportedAuthMethods.length > 0) {
  //   metadata.token_endpoint_auth_methods_supported = options.supportedAuthMethods;
  // }

  // if (options.supportedSigningAlgs && options.supportedSigningAlgs.length > 0) {
  //   metadata.token_endpoint_auth_signing_alg_values_supported = options.supportedSigningAlgs;
  // }

  // if (options.supportedUILocales && options.supportedUILocales.length > 0) {
  //   metadata.ui_locales_supported = options.supportedUILocales;
  // }

  if (options.serviceDocumentation) {
    metadata.service_documentation = options.serviceDocumentation;
  }

  // TODO: Check this further.
  metadata.jwks_uri = `${options.baseUrl}${endpoints?.jwks ?? '/oauth/jwks'}`;

  return metadata;
}
