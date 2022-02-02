export interface User {
    _id: string;
    _key: string;
    displayName: string;
    activeRole: string;
    age?: number;
    churchID?: number;
    personID?: number;
    authorityLevel?: number;
    roles?: Array<Role>
}

export interface Role {
    _id: string;
    name: string;
    securityLevel: number;
    enumName: string;
}
