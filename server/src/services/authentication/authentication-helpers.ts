
var _ = require('lodash');


export function getRolesForPerson(existingPerson:any) {

  var roles = existingPerson.related.roles;

  let rolesFormattet: PermissionRole[] = [];
  for (let i of roles) {
    const item: PermissionRole = {
      name: i.name,
      enumName: i.enumName,
      org: [i.personRole.org],
      scope: i.personRole.scope,
      securityLevel: i.securityLevel,
    };
    rolesFormattet.push(item);
  }

  let memberRole: PermissionRole = {
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


  const withoutDuplicates = combineRolesTypes(rolesFormattet)
  return withoutDuplicates;
}

function combineRolesTypes(roles:any){
  let combined :any =[]
  for (const role of roles) {
    let exist = _.find(combined,['name',role.name])

    if(!exist){
      combined.push(role)
    }else{
      exist.org = [...exist.org, ...role.org]
    }
  }
  return combined
}


export type RoleName = 'CentralAdministrator'
    | 'Arrangementsansvarlige'
    | 'SentralInformasjonsmedarbeider'
    | 'BrunstadKontaktperson'
    | 'PMOManager'
    | 'BCCAnsatt'
    | 'Developer'
    | 'Innmelder'
    | 'Forstander'
    | 'HeadOfCommunications'
    | 'ChairmanOfTheBoard'
    | 'FinanceManager'
    | 'SundaySchoolLeader'
    | 'Informasjonsmedarbeider'
    | 'OrgRepresentative'
    | 'VotingAdmin'
    | 'Member'
    | 'Org'
    | 'None';

export interface Role {
    _id: string;
    enumName: RoleName;
    name: string;
    roleID?: number;
    securityLevel: number;
}

export interface PermissionRole {
    name: string;
    enumName: RoleName;
    org?: [string];
    scope: string;
    securityLevel: number;
}
