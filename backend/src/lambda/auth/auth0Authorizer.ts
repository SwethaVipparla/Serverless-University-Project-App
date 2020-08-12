import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda'
import 'source-map-support/register'
import {verify} from 'jsonwebtoken'
import {createLogger} from '../../utils/logger'
import Axios, {AxiosResponse} from 'axios'
import {JwtPayload} from '../../auth/JwtPayload'
import {JWKS} from "../../auth/JWK";

const logger = createLogger('auth')

// Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set

const JWKSURL = 'https://dev-du1071hk.us.auth0.com/.well-known/jwks.json';

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user', event.authorizationToken)
    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        logger.info('User was authorized', jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', {error: e.message})

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader)

    // Implement token verification
    // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

    const jwk: AxiosResponse<JWKS> = await Axios.get(JWKSURL);
    const certificate: string = getPEMCert(jwk.data.keys[0].x5c[0]);

    return verify(token, certificate, {algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return token
}

function getPEMCert(certificate: string): string {
    return `-----BEGIN CERTIFICATE-----\n${certificate.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`;
}