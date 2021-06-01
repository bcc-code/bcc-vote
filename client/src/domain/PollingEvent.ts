export interface PollingEvent {
    _id: string;
    _key: string;
    title: string;
    description: string;
    type: PollingEventType;
    status:PollingEventStatus;
    startDateTime: Date;
    creatorId: string;
    participantFilter: ParticpantFilters;
}

export interface ParticpantFilters {
    orgs: string
    roles: string;
    minAge: number;
    maxAge: number;
}

export enum PollingEventType {
    'Live Event' = 'live_event',
    'Survey' = 'survey'
}


export enum PollingEventStatus {
    'Live' = 'live',
    'Not Started' = 'not_started',
    'Finished' = 'finished'
}