export interface PollingEvent {
    _id: string;
    _key: string;
    title: string;
    description: string;
    type: PollingEventType;
    status:PollingEventStatus;
    startDateTime: Date;
    creatorId: number;
    participantFilter: ParticipantFilters;
}

export interface PollingEventPrepare {
    title: string;
    description: string;
    type: PollingEventType;
    status:PollingEventStatus;
    startDateTime: Date;
    creatorId: number;
    participantFilter: ParticipantFilters;
}

export interface ParticipantFilters {
    org: string
    role: string;
    minAge?: number;
    maxAge?: number;
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