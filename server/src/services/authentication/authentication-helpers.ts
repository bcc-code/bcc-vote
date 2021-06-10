
var _ = require('lodash');
import { Role } from '../../domain';

const rolesInUseInApp = ['CentralAdministrator','SentralInformasjonsmedarbeider','Developer','VotingAdmin','Member'];

export function getRolesForPerson(existingPerson:any):Array<Role> {

    const roles = existingPerson.related.roles;
    const rolesFiltered = roles.filter((r:any) => rolesInUseInApp.includes(r.enumName));

    const rolesFormattet: Role[] = [];
    for (const i of rolesFiltered) {
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

    // Sort the permission from highest level to lowest level
    rolesFormattet.sort(function (a, b) {
        return a.securityLevel - b.securityLevel;
    });

    const withoutDuplicates = combineRolesTypes(rolesFormattet);
    return withoutDuplicates;
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
