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
    org: [];
    scope: string;
    active: boolean;
    securityLevel: number;
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
    | 'Member'
    | 'Org'
    | 'None';