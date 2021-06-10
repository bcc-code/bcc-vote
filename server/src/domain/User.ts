export type UserDetails = {[key: string]: any} & {
    personKey?:string,
    twoFaDisabled?:boolean,
    activeRole?:string,
    verifiedCode?: any,
    secretInUse?: any,
    tempSecret?: any
}

export type Role = {
    name: string;
    enumName: string;
    org: Array<string>;
    scope: string;
    securityLevel: number;
}

export type RoleName = 'CentralAdministrator'
    | 'SentralInformasjonsmedarbeider'
    | 'Developer'
    | 'Member'
    | 'VotingAdmin';
