export interface PollingEvent {
    _id: string;
    _key: string;
    title: string;
    description: string;
    type: string;
    startDateTime: Date;
    creatorI?: string;
    participantFilter?: ParticpantFilters;
}

export interface ParticpantFilters {
    orgs?: Array<string>;
    roles?: Array<string>;
    minAge?: number;
    maxAge?: number;
}