export interface User {
    age?: number;
    churchID?: string;
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
