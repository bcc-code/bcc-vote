export interface User {
    _id: string;
    _key: string;
    age: number;
    activeRole: string;
    churchID: number;
    personID: number;
    authorityLevel?: number;
    roles: Array<Role>
}

export interface Role {
    _id: string;
    name: string;
    securityLevel: number;
    enumName: string;
    orgIDs: number[];
}
