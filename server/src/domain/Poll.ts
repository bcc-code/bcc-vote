export interface Poll {
    _id: string,
    _key: string,
    firestore?: boolean;
    title: string;
    pollingEventId: string;
    description: string;
    confirmAnswer: boolean;
    answers: Option[],
    answerCount: {[answerId: number]: number},
    activeStatus: PollActiveStatus;
    resultVisibility: PollResultVisibility;
  }

export enum PollActiveStatus {
    'Not Started' = 'not_started',
    'Live' = 'live',
    'Finished' = 'finished',
}

export interface Option {
    label: string,
    explanation: string,
    answerId: number,
}

export enum PollResultVisibility {
    'Public' = 'public',
    'Non Public' = 'non_public',
    'Anonymous' = 'anonymous',
}
  

