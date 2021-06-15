import { Ability, ForcedSubject, AbilityBuilder } from '@casl/ability';
import { RoleName, UserDetails } from '../domain';

export const actions = ['manage','patch','update','find','get','remove','create'] as const;
export const subjects = ['answer','polling-event','poll', 'poll-result','participant','person','org', 'role', 'all'] as const;
export type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];
export class AppAbility extends Ability<AppAbilities>{}

type DefinePermissions = (user: UserDetails, builder: AbilityBuilder<AppAbility>) => void;

const globalPermissions = (user: UserDetails, { can, cannot }: AbilityBuilder<AppAbility>) => {
    can('create','answer', { _to: user._id });
    can('find', 'answer');
    can('find','poll');
    can('get', 'poll');
    can('get', 'poll-result');
    can(['find','get'],'polling-event', {'participantFilter.org': user.churchID.toString()});
    can(['find','get'],'polling-event',{
        'participantFilter.org': 'all'as any,
        'participantFilter.role': 'all'as any
    });
    can(['find','get'],'polling-event', {'participantFilter.role': 'Member' as any});
    cannot(['find','get'],'polling-event',{'participantFilter.minAge': {$gte:user.age}});
    cannot(['find','get'],'polling-event',{'participantFilter.maxAge': {$lte:user.age}});
    cannot('find', 'polling-event', {'status': 'archived' as any});
    can(['find','get'],'polling-event', {'creatorId':user.personID as any});
    
};


const rolePermissions: Record<string, DefinePermissions> = {
    SuperAdmin(user, { can, cannot }) {
        can('create','poll');
        can('update', 'poll');
        can('remove', 'poll');
        can('patch', 'poll');

        can('patch', 'polling-event');
        can('update', 'polling-event');
        can('create','polling-event');
        can('remove', 'answer');

        can('find', 'org');
        can('find', 'role');
        can('find', 'answer');

        can(['find','get'],'polling-event', {'participantFilter.role': { $in: superAdminRoles } as any});
    },
    VotingAdmin(user, { can, cannot }) {
        const userChurchID = user.churchID.toString();
        can('create','poll');
        can('update', 'poll');
        can('remove', 'poll');
        can('patch', 'poll');

        can('patch', 'polling-event', { 'participantFilter.org': userChurchID });
        can('update', 'polling-event', { 'participantFilter.org': userChurchID });
        can('create','polling-event', { 'participantFilter.org': userChurchID });

        can('find', 'org');
        can('find', 'role');
        can('find', 'answer');
        can('remove', 'answer');
        can('get', 'answer');
    },
    Member(user, { can, cannot }) {
    }
};

const superAdminRoles = ['Developer','CentralAdministrator','SentralInformasjonsmedarbeider'];

export function defineAbilityFor(user:UserDetails, activeRole?:RoleName): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(AppAbility);
    let abilityRole = activeRole === undefined ? user.activeRole : activeRole as string;
    if(!abilityRole) {
        throw new Error(`Trying to use invalid role ${abilityRole}`);
    }

    if(superAdminRoles.includes(abilityRole)) {
        abilityRole = 'SuperAdmin';
    }
    globalPermissions(user, builder);
    rolePermissions[abilityRole](user, builder);

    return builder.build();
}
