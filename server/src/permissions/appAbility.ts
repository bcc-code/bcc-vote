import { Ability, ForcedSubject, AbilityBuilder } from '@casl/ability';
import { PollResultVisibility, RoleName, User, UserRole } from '../domain';

export const actions = ['manage','patch','update','find','get','remove','create'] as const;
export const subjects = ['answer','polling-event','poll', 'poll-result', 'feedback','participant','person','org', 'role', 'user', 'all'] as const;
export type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];
export class AppAbility extends Ability<AppAbilities>{}

type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

const globalPermissions = (user: User, { can, cannot }: AbilityBuilder<AppAbility>) => {
    const userRoleNames = user.roles.map((r:UserRole) => r.enumName);
    can('create','answer', { _to: user._id } as any);
    can('find', 'answer', {'visibility': PollResultVisibility["Public"] as any});
    can('get', 'answer', {_to: user._id} as any);
    can('find','poll');
    can('get', 'poll');
    can('get', 'poll-result');
    can('create', 'feedback');
    can(['find','get'],'polling-event', {'participantFilter.org': {$in: [user.churchID.toString(), 'all']}, 'participantFilter.role': { $in: [...userRoleNames, 'all'] }} as any);
    cannot(['find','get'],'polling-event',{'participantFilter.minAge': {$gte:user.age}} as any);
    cannot(['find','get'],'polling-event',{'participantFilter.maxAge': {$lte:user.age}} as any);
    cannot('find', 'polling-event', {'status': 'archived' as any});
    can(['find','get'],'polling-event', {'creatorId':user.personID as any});
};


const rolePermissions: Record<string, DefinePermissions> = {
    SuperAdmin(user, { can }) {
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
        can('find', 'answer', {'visibility': PollResultVisibility["Non Public"] as any});
        can('find', 'user');

        can('find', 'poll-result');

        can(['find','get'],'polling-event', {'participantFilter.role': { $in: superAdminRoles } as any});
    },
    VotingAdmin(user, { can }) {
        const votingAdminFor = user.roles.filter((r:UserRole) => r.enumName == 'VotingAdmin')[0].orgIDs;
        can('create','poll');
        can('update', 'poll');
        can('remove', 'poll');
        can('patch', 'poll');

        can('patch', 'polling-event', { 'participantFilter.org': { $in: votingAdminFor.map(String)}} as any);
        can('update', 'polling-event', { 'participantFilter.org': { $in: votingAdminFor.map(String)}} as any);
        can('create','polling-event', { 'participantFilter.org': { $in: votingAdminFor.map(String)}} as any);

        //Investigate this permission, org permissions seem to not be working
        can('find', 'org', { orgID: { $in: votingAdminFor}} as any);
        can('find', 'role');
        can('find', 'answer', {'visibility': PollResultVisibility["Non Public"] as any});
        can('find', 'user', {'churchID': { $in: votingAdminFor}} as any);

        can('find', 'poll-result');

        can('remove', 'answer');
        can('get', 'answer');
    },
    Member(user, { can, cannot }) {

    }
};

const superAdminRoles = ['Developer','CentralAdministrator','SentralInformasjonsmedarbeider'];

export function defineAbilityFor(user:User, activeRole?:RoleName): AppAbility {
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
