import jsonwebtoken, { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken';
import logger from "../../logger";
import { PermissionRole } from "../../domain/Role";
var _ = require('lodash');

export function verifyAuth0AccessToken(accessToken:string):{[key:string]:any}{
  logger.info(`Attempting to verify accessToken to see if it is coming from Auth0`);
  var fs = require('fs');
  var env = process.env.NODE_ENV;
  const publicKey = fs.readFileSync(`../server/config/${env}-public.key`)
  accessToken = accessToken.replace("Bearer ","");
  const payload = <object>jsonwebtoken.verify(accessToken, publicKey);
  return payload
}

export async function getRolesForPerson(existingPerson:any) {

  var roles = existingPerson.related.roles;

  let rolesFormattet: PermissionRole[] = [];
  for (let i of roles) {
    const item: PermissionRole = {
      name: i.name,
      enumName: i.enumName,
      org: [i.personRole.org],
      scope: i.personRole.scope,
      active: false,
      securityLevel: i.securityLevel,
    };
    rolesFormattet.push(item);
  }

  let memberRole: PermissionRole = {
    name: "Member",
    enumName: "Member",
    org: ["org/"],
    scope: "churchLevel",
    active: false,
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
