export interface Poll {
  _id: string,
  _key: string,
  title: string;
  pollingEventId: string;
  description: string;
  confirmAnswer: boolean;
  answers: Option[],
  activeStatus: PollActiveStatus;
  resultVisibility: PollResultVisibility;
}

export interface PollPrepare {
  title: string;
  description: string;
  answers: Option[],
  activeStatus: PollActiveStatus;
  resultVisibility: PollResultVisibility;
}

export interface Option {
  label: string,
  explanation: string,
  answerId: number,
}

export interface SortedOptions {
    [answerId: number]: SortedOption
}

export interface SortedOption {
    label: string,
    explanation: string,
    answerId: number,
    count:number, 
    bgColor: string
}
export interface Answer {
    _id: string;
    _key: string;
    _from: string;
    _to: string;
    answerId: number;
    pollingEventId: number;
    displayName: string;
  }

export enum PollActiveStatus {
  'Not Started' = 'not_started',
  'Live' = 'live',
  'Finished' = 'finished',
}

export enum PollResultVisibility {
  'Public' = 'public',
  'Non Public' = 'non_public',
  'Anonymous' = 'anonymous',
}
