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

import {URL} from 'url';
import {createRemoteJWKSet, jwtVerify, JWTVerifyResult, JWTPayload, JWTVerifyOptions, ResolvedKey} from 'jose';

export default async function validateToken(
  accessToken: string,
  jwksUri: string,
  options: JWTVerifyOptions,
): Promise<JWTVerifyResult<JWTPayload>> {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error('Access Token must be a non-empty string.');
  }

  let jwksUrl: URL;
  try {
    jwksUrl = new URL(jwksUri);
  } catch {
    throw new Error('Invalid JWKS URI.');
  }

  if (!options || typeof options !== 'object') {
    throw new Error('Validation options must be provided.');
  }

  const {issuer, audience, clockTolerance} = options;
  if (!issuer || typeof issuer !== 'string') {
    throw new Error('Issuer must be a non-empty string in options.');
  }

  const JWKS: ReturnType<typeof createRemoteJWKSet> = createRemoteJWKSet(jwksUrl);

  try {
    const result: JWTVerifyResult<JWTPayload> & ResolvedKey = await jwtVerify(accessToken, JWKS, {
      audience,
      clockTolerance,
      issuer,
    });

    const SUPPORTED_SIGNATURE_ALGORITHMS: string[] = ['RS256', 'RS512', 'RS384', 'PS256'];

    if (!SUPPORTED_SIGNATURE_ALGORITHMS.includes(result.protectedHeader.alg)) {
      throw new Error(
        `Unsupported token algorithm: ${
          result.protectedHeader.alg
        }. Supported algorithms: ${SUPPORTED_SIGNATURE_ALGORITHMS.join(', ')}`,
      );
    }

    return result;
  } catch (error: any) {
    if (error.code) {
      switch (error.code) {
        // JWKS specific issues
        case 'ERR_JWKS_TIMEOUT':
          throw new Error(`Timeout while fetching JWKS from ${jwksUri}: ${error.message}`);
        case 'ERR_JWKS_NO_MATCHING_KEY':
          throw new Error(`No matching key found in JWKS at ${jwksUri} for the token's header: ${error.message}`);
        case 'ERR_JWKS_INVALID':
          throw new Error(`Invalid or malformed JWKS found at ${jwksUri}: ${error.message}`);

        // JWS/JWT structural or signature issues
        case 'ERR_JWS_INVALID':
          throw new Error(`Invalid JWS structure: ${error.message}`);
        case 'ERR_JWT_INVALID':
          throw new Error(`Invalid JWT structure or payload: ${error.message}`);
        case 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED':
          throw new Error(`Token signature verification failed: ${error.message}`);

        // Common JWT claim validation issues
        case 'ERR_JWT_EXPIRED':
          throw new Error(`Token has expired: ${error.message}`);
        case 'ERR_JWT_CLAIM_VALIDATION_FAILED':
          throw new Error(`JWT claim validation failed (${error.claim || 'unknown claim'}): ${error.message}`);

        // Other JOSE potential issues
        case 'ERR_JOSE_ALG_NOT_ALLOWED':
          throw new Error(`Token algorithm is not allowed: ${error.message}`);
        case 'ERR_JOSE_NOT_SUPPORTED':
          throw new Error(`An unsupported JOSE feature/algorithm was encountered: ${error.message}`);

        default:
          throw new Error(`JOSE validation error: ${error.message} (Code: ${error.code})`);
      }
    }

    // Fallback for non-JOSE errors or errors without a code property
    throw new Error(
      `An unexpected error occurred during token validation: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
