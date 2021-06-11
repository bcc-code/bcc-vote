
var _ = require('lodash');
import { Role, RoleName } from '../../domain';

const rolesInUseInApp = ['CentralAdministrator','SentralInformasjonsmedarbeider','Developer','VotingAdmin','Member'];

export function getRolesForPerson(existingPerson:any): { roles: Array<Role>, activeRole: RoleName} {

    const roles = existingPerson.related.roles;

    let rolesFormattet: Array<Role> = [];
    for (const i of roles) {
        const item:Role = {
            name: i.name,
            enumName: i.enumName,
            org: [i.personRole.org],
            scope: i.personRole.scope,
            securityLevel: i.securityLevel,
        };
        rolesFormattet.push(item);
    }

    const memberRole: Role = {
        name: "Member",
        enumName: "Member",
        org: ["org/"],
        scope: "churchLevel",
        securityLevel: 8,
    };
    rolesFormattet.push(memberRole);

    const activeRole = getActiveRole(rolesFormattet);
    const withoutDuplicates = combineRolesTypes(rolesFormattet);

    return { roles: withoutDuplicates, activeRole: activeRole};
}

function combineRolesTypes(roles:any){
    let combined:any = [];
    for (const role of roles) {
        let exist = _.find(combined,['name',role.name]);

        if(!exist){
            combined.push(role);
        }else{
            exist.org = [...exist.org, ...role.org];
        }
    }
    return combined;
}

function getActiveRole(userRoles:any):RoleName{
    let activeRole = 'None' as RoleName;
    let possibleActiveRoles = userRoles.filter((role:Role) => rolesInUseInApp.includes(role.enumName));

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