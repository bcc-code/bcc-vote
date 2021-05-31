import { Ability, ForcedSubject, AbilityBuilder } from '@casl/ability';
import { UserDetails, RoleName } from '../domain';

export const actions = ['manage','export','patch','update','find','get','remove','create'] as const;
export const subjects = ['person','relation','affiliation','org','country','profile-picture','role','personrole','administrator','audit','all'] as const;
export type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];
export class AppAbility extends Ability<AppAbilities>{};

type DefinePermissions = (user: any, builder: AbilityBuilder<AppAbility>) => void;

const globalPermissions = (user: UserDetails, { can, cannot }: AbilityBuilder<AppAbility>) => {
    can('patch','person', ['requestedChanges.tokenCode','requestedChanges.roles.**'],{_key: user._key})
    can('get','person',['_key','_id'],{_key: user._key})
    cannot('get','person',['tempSecret.**','secretInUse.**'])
    cannot('find','person',['tempSecret.**','secretInUse.**'])
}

const rolePermissions: Record<RoleName, DefinePermissions> = {
  CentralAdministrator(user, { can, cannot }) { // 1
  },
  Developer(user, { can, cannot }) { // 2
    can('manage', 'all');
  },
  SentralInformasjonsmedarbeider(user, { can, cannot }) { // 3
    can('find','person')
    can('get','person')
    can('find','org')
    can('find','personrole')
    can ('export','person')
  },
  BCCAnsatt(user, { can, cannot }) { // 4
    can('find','person',{activeStatusCode:ActiveStatus["Active"]})
    can('get','person')
    cannot('find','person',['activeStatusCode','davidsColumn.**'])

    can('find','org')
    can('find','personrole')
    can('find','country')
  },
  Arrangementsansvarlige(user, { can, cannot }) { // 5
    can('find','person',{activeStatusCode:ActiveStatus["Active"]})
    can('export','person')
    can('get','person')
    can('find','org')
    can('find','country')
    can('find','personrole',{'_to.enumName':'PMOManager'})

    can('manage', "affiliation");
  },
  PMOManager(user, { can, cannot }) { // 6
    let pmoMangerFor = (find(user.roles,['enumName','PMOManager']))?.org
    can('create', 'person');
    can ('export','person')
    can('patch','person',{'church.org._id':{$in:pmoMangerFor}})
    cannot('patch','person',['requestedChanges.profileVisibility','requestedChanges.bccNorwayStartdate'])
    cannot('patch','person',{'requestedChanges.activeStatusCode':ActiveStatus["Inactive"]})
    can('get','person',{'church.org._id':{$in:pmoMangerFor}})
    can('find','person',{'church.org._id':{$in:pmoMangerFor}})
    can('find','person',['_id'],{'administrator':true})

    can('find','org')

    can('create', "affiliation");
    can('remove', "affiliation");
    can('find', "affiliation",{'_to._id':{$in:pmoMangerFor}});
    can('find', "affiliation",{'previousOrg._id':{$in:pmoMangerFor}});
    can('patch','affiliation',["requestedChanges.startDate", "requestedChanges._from", "requestedChanges.number", "requestedChanges.createdBy", "requestedChanges.timestamp", "requestedChanges.previousOrg"], {'_to':{$in:pmoMangerFor}});

    can('manage', 'relation');

    can('manage','profile-picture')

    can('find','country')

    can('find','role')

    can('find', 'audit',{'field_id.church.org._id':{$in:pmoMangerFor}});
    can('export', 'audit',{'field_id.church.org._id':{$in:pmoMangerFor}});

    can('find','personrole',['_id','_from.activeStatusCode','_from.displayName','scope','_from.email','org.***','country.***','_to.***'],{'_to.enumName':'PMOManager'})
  },
  Innmelder(user, { can, cannot }) { // 7
    cannot('remove','all')
  },
  Informasjonsmedarbeider(user, { can, cannot }) { // 8
    can('find','org')
    can('find','person',['personID','profilePicture.**','lastName','firstName','middleName','displayName','age','cellPhone.**', 'homePhone.**','email','church.**','currentAddress.**',])
  },
  BrunstadKontaktperson(user, { can, cannot }) { // 9
  },
  Org(user, { can, cannot }) {
    can('manage', 'all');
    cannot('remove','person')
    cannot('remove','org')
  },
  Member(user, { can, cannot }) { // 10
    const {allowedFieldsToChange, allowedFieldsToFind, memberChurch, allChildren, allDependants, childrenUnder15, fosterChildrenUnder15, legalDependentUnder15} = getMemberVariables(user)

    if(user.age > 14) {
        can('patch','person',allowedFieldsToChange, {_key: user._key })
        can('patch','person',['requestedChanges.consent.**','requestedChanges.profileVisibility'], {_key: user._key })
        can('manage','profile-picture', { _key: user._key })
        can('find','administrator',['_from.displayName'],{ org: memberChurch });
        can('update','administrator', { _key: user._key });
    }
    can('find','person',allowedFieldsToFind , { _key: user._key })
    can('get','person',{ _key: user._key })

    // Members connected to User
    can('get','person',allowedFieldsToFind, { _key: { $in: [ ...allChildren, ...allDependants]}})
    can('find','person',allowedFieldsToFind , { _key: { $in: [ ...allChildren, ...allDependants]}})
    can('patch','person',allowedFieldsToChange, { _key: { $in: [ ...allChildren, ...allDependants]}})
    can('patch','person',['requestedChanges.profileVisibility','requestedChanges.consent.**'], { _key: { $in: [...childrenUnder15, ...fosterChildrenUnder15, ...legalDependentUnder15]}})
    can('manage','profile-picture', { _key: { $in: [ ...allChildren, ...allDependants]}})

    // Find other public and local members
    can('find','person',allowedFieldsToFind , { profileVisibility:ProfileVisibility["Public"]})
    can('find','person',allowedFieldsToFind , {
                                                profileVisibility:ProfileVisibility["Local"],
                                                churchID:user.churchID
                                              })
    
    can('find','org',{ type: 'organisation'})

    can('find','country')
  },
  Forstander(user, { can, cannot }) {
    cannot('manage','all')
  },
  HeadOfCommunications(user, { can, cannot }) {
  },
  ChairmanOfTheBoard(user, { can, cannot }) {
  },
  FinanceManager(user, { can, cannot }) {
  },
  SundaySchoolLeader(user, { can, cannot }) {
  },
  None(user, { can, cannot }) {
    cannot('manage', 'all');
  },
};

export function defineAbilityFor(user:UserDetails, role: RoleName): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(AppAbility);

  if (typeof rolePermissions[role] === 'function') {
    rolePermissions[role](user, builder);
    globalPermissions(user, builder);
  } else {
    throw new Error(`Trying to use unknown role ${role}`);
  }

  return builder.build();
}
