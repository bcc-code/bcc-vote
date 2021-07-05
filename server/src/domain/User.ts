export type User = {[key: string]: any} & {
    _id: string;
    _key: string;
    personID: number;
    churchName: string;
    churchID: string;
    activeRole:RoleName;
    administrator: boolean;
    email: string;
    roles: Array<UserRole>;
    displayName: string;
    age: number;
    cellPhone?: any;
}

export type UserRole = Role & {
    organisationID: Array<number>;
    org_id: Array<string>;
    scope: string;
}

export type Role = {
    _id?: string;
    enumName: RoleName;
    name: string;
    roleID?: number;
    securityLevel: number;
}

export type RoleName = 'CentralAdministrator'
    | 'SentralInformasjonsmedarbeider'
    | 'Developer'
    | 'Member'
    | 'VotingAdmin'
    | 'None';
