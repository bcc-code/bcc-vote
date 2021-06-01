import { Ability, ForcedSubject, AbilityBuilder } from '@casl/ability';
import { UserDetails, RoleName } from '../domain';

export const actions = ['manage','patch','update','find','get','remove','create'] as const;
export const subjects = ['answer','polling-event','poll','participant','person','org','all'] as const;
export type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];
export class AppAbility extends Ability<AppAbilities>{};

type DefinePermissions = (user: any, builder: AbilityBuilder<AppAbility>) => void;

const globalPermissions = (user: UserDetails, { can, cannot }: AbilityBuilder<AppAbility>) => {

  can('find','polling-event', {churchID: user.church.org.churchID})
  can('find','polling-event', {churchID: 'all'as any})
  cannot('find','polling-event',{minAge: {$gte:user.age}})
  cannot('find','polling-event',{maxAge: {$lte:user.age}})



}

export function defineAbilityFor(user:UserDetails): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(AppAbility);
  globalPermissions(user, builder);
  return builder.build();
}
