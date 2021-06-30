import { Role, RoleName } from '../../domain';

const rolesInUseInApp = ['CentralAdministrator','SentralInformasjonsmedarbeider','Developer','VotingAdmin','Member'];


export function getActiveRole(userRoles:any):RoleName{
    let activeRole = 'None' as RoleName;
    const possibleActiveRoles = userRoles.filter((role:Role) => rolesInUseInApp.includes(role.enumName));

    // Sort the permission from highest level to lowest level
    possibleActiveRoles.sort(function (a:Role, b:Role) {
        return a.securityLevel - b.securityLevel;
    });

    if(possibleActiveRoles.some((role:Role) => role.enumName === 'VotingAdmin')) { 
        activeRole = 'VotingAdmin';
    } else {
        activeRole = possibleActiveRoles[0].enumName;
    }
    return activeRole;
}