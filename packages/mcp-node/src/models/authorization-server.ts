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
 * Interface representing the OAuth 2.0 Authorization Server Metadata as defined in RFC 8414.
 * This metadata describes the configuration and capabilities of an authorization server.
 * @see https://datatracker.ietf.org/doc/html/rfc8414#section-3.2
 */
export interface AuthorizationServerMetadata {
  /** The authorization endpoint URL of the authorization server */
  authorization_endpoint: string;
  /** The issuer identifier URL of the authorization server */
  issuer: string;
  /** URL of the authorization server's JWK Set document containing signing keys */
  jwks_uri?: string;
  /** URL of the authorization server's client registration endpoint */
  registration_endpoint?: string;
  /** Array of OAuth 2.0 response_type values that the authorization server supports */
  response_types_supported: string[];
  /** Array of OAuth 2.0 scope values that the authorization server supports */
  scopes_supported?: string[];
  /** URL of a page containing human-readable documentation for the authorization server */
  service_documentation?: string;
  /** The token endpoint URL of the authorization server */
  token_endpoint: string;
  /** Array of client authentication methods supported by the token endpoint */
  token_endpoint_auth_methods_supported?: string[];
  /** Array of JWS signing algorithms supported for the token endpoint */
  token_endpoint_auth_signing_alg_values_supported?: string[];
  /** Array of user interface languages supported */
  ui_locales_supported?: string[];
  /** URL of the authorization server's UserInfo Endpoint */
  userinfo_endpoint?: string;
}

/**
 * Configuration options for creating authorization server metadata.
 * These options are used to generate the complete authorization server metadata.
 */
export interface AuthorizationServerMetadataOptions {
  /** The base URL of the authorization server */
  baseUrl: string;
  /** Optional URL pointing to the service documentation */
  serviceDocumentation?: string;
}

/**
 * Interface representing the OAuth 2.0 Protected Resource Metadata.
 * This metadata describes the configuration and capabilities of a protected resource.
 * @see https://datatracker.ietf.org/doc/html/draft-ietf-oauth-resource-metadata
 */
export interface ProtectedResourceMetadata {
  /** Array of authorization server URLs that the protected resource trusts */
  authorization_servers: string[];
  /** Array of supported bearer token presentation methods */
  bearer_methods_supported: string[];
  /** The URL of the protected resource */
  resource: string;
  /** URL of the protected resource's documentation */
  resource_documentation?: string;
  /** Array of OAuth 2.0 scope values that the protected resource supports */
  scopes_supported?: string[];
}

/**
 * Configuration options for creating protected resource metadata.
 */
export interface ProtectedResourceMetadataOptions {
  /** Array of authorization server URLs that the protected resource trusts */
  authorizationServers: string[];
  /** Array of supported bearer token presentation methods */
  bearerMethodsSupported?: string[];
  /** The URL of the protected resource */
  resource: string;
  /** URL of the protected resource's documentation */
  resourceDocumentation?: string;
  /** Array of OAuth 2.0 scope values that the protected resource supports */
  supportedScopes?: string[];
}
