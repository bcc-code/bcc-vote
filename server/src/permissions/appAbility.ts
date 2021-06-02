import { Ability, ForcedSubject, AbilityBuilder } from '@casl/ability';
import { UserDetails, Role } from '../domain';

export const actions = ['manage','patch','update','find','get','remove','create'] as const;
export const subjects = ['answer','polling-event','poll','participant','person','org', 'role', 'all'] as const;
export type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];
export class AppAbility extends Ability<AppAbilities>{}

type DefinePermissions = (user: any, builder: AbilityBuilder<AppAbility>) => void;

const globalPermissions = (user: UserDetails, { can, cannot }: AbilityBuilder<AppAbility>) => {

    const userRoleEnums = user.roles.map((r:Role) => r.enumName);
  if(user.roles.filter((r:Role) => r.enumName === 'Developer').length) {
    can('create','poll');
    can('update', 'poll');
    can('remove', 'poll');
    can('patch', 'polling-event');
    can('patch', 'poll');
    can('find', 'org');
    can('find', 'role');
  }

  can('create','answer');
  can('find', 'answer');
  can('find','poll');
  can('find','person');
  
  can('get', 'poll');

    can('create','polling-event');
    can('get','polling-event');
    // can('find','polling-event', {'participantFilter.org': user.churchID.toString()})
    // can('find','polling-event', {'participantFilter.org': 'all'as any})
    can('find','polling-event', {'participantFilter.role': 'all'as any})
    can('find','polling-event', {'participantFilter.role': { $in: userRoleEnums } as any})
    cannot('find','polling-event',{'participantFilter.minAge': {$gte:user.age}})
    cannot('find','polling-event',{'participantFilter.maxAge': {$lte:user.age}})
    can('find','polling-event', {'creatorId':user.personID as any})
}

export function defineAbilityFor(user:UserDetails): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(AppAbility);
  globalPermissions(user, builder);
  return builder.build();
}
