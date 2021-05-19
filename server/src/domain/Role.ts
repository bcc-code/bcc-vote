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

export interface Role {
    _id: string;
    enumName: RoleName;
    name: string;
    roleID?: number;
    securityLevel: number;
}

export interface PermissionRole {
    name: string;
    enumName: RoleName;
    org?: [string];
    scope: string;
    active: boolean;
    securityLevel: number;
}
