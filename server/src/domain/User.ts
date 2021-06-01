export type UserDetails = {[key: string]: any} & {
    personKey?:string,
    twoFaDisabled?:boolean,
    activeRole?:string,
    verifiedCode?: any,
    secretInUse?: any,
    tempSecret?: any
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