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
  lastChanged: number;
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
  answerId: string,
}

export interface SortedOptions {
    [answerId: string]: SortedOption
}

export interface SortedOption {
    label: string,
    explanation: string,
    answerId: string,
    count:number, 
    bgColor: string
}
export interface Answer {
    _id: string;
    _key: string;
    _from: string;
    _to: string;
    visibility: PollResultVisibility;
    answerId: string;
    pollingEventId: number;
    displayName: string;
    lastChanged: number;
}

export type PollingEventAnswerBatch = {
    pollingEventId: string,
    answers: Answer[]
}

export interface PollResult {
    pollingEventId: string;
    pollId: string;
    answerCount: {[answerId: string]: number}
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
