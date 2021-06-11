export type UserDetails = {[key: string]: any} & {
    activeRole?:RoleName,
}

export type Role = {
    name: string;
    enumName: RoleName;
    org: Array<string>;
    scope: string;
    securityLevel: number;
}

export type RoleName = 'CentralAdministrator'
    | 'SentralInformasjonsmedarbeider'
    | 'Developer'
    | 'Member'
    | 'VotingAdmin'
    | 'None';
