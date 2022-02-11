import { UserRole, RoleName, User } from '../../domain';
import jwksClient, {JwksClient} from 'jwks-rsa';
import jsonwebtoken from 'jsonwebtoken';
import logger from '../../logger';
import { Application } from '@feathersjs/feathers';

const rolesInUseInApp = ['CentralAdministrator','SentralInformasjonsmedarbeider','Developer','VotingAdmin','Member'];

let client: undefined | JwksClient;

export function getActiveRole(userRoles:Array<UserRole>):RoleName{
    let activeRole = 'None' as RoleName;
    const possibleActiveRoles = userRoles.filter((role:UserRole) => rolesInUseInApp.includes(role.enumName));

    // Sort the permission from highest level to lowest level
    possibleActiveRoles.sort(function (a:UserRole, b:UserRole) {
        return a.securityLevel - b.securityLevel;
    });

    if(possibleActiveRoles.some((role:UserRole) => role.enumName === 'VotingAdmin')) {
        activeRole = 'VotingAdmin';
    } else {
        activeRole = possibleActiveRoles[0].enumName;
    }
    return activeRole;
}

export async function verifyAuth0AccessToken(
    accessToken: string,
    jwks_url: string,
    issuer: string
): Promise<{[key: string]: any}> {
    accessToken = accessToken.replace('Bearer ', '');
    try {
        if (client === undefined) {
            client = jwksClient({
                jwksUri: jwks_url,
                requestHeaders: {}, // Optional
                timeout: 30000, // Defaults to 30s
            });
        }

        const decoded = jsonwebtoken.decode(accessToken, {complete: true}) as {[key: string]: any};
        const kid = decoded?.header?.kid;
        const key = await client.getSigningKey(kid);
        const publicKey = key.getPublicKey();

        const payload = <Record<string, any>>jsonwebtoken.verify(accessToken, publicKey, {
            issuer,
        });
        return payload;
    } catch (error) {
        logger.error('Error verifying accessToken with publicKey from Auth0, please inspect error.', {accessToken, error});
        throw error;
    }
}

export async function getUserBasedOnPayLoad(payload: Record<string, any>, app: Application): Promise<User | null> {
    const personID = payload['https://login.bcc.no/claims/personId'];
    const user = await app.services.person.get(personID.toString());
    user.authTime = payload.iat;
    user.roles = user.related.roles;

    user.activeRole = getActiveRole(user.related.roles);

    return user;
}
