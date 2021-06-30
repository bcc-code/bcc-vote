import { UserRole, RoleName } from '../../domain';

const rolesInUseInApp = ['CentralAdministrator','SentralInformasjonsmedarbeider','Developer','VotingAdmin','Member'];

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