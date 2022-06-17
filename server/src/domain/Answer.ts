import { PollResultVisibility } from "./Poll";

export type Answer = {
    _id: string;
    _key: string;
    _from: string;
    _to: string;
    visibility: PollResultVisibility
    answerId: string;
    pollingEventId: string;
    displayName: string;
}

export type PollingEventAnswerBatch = {
    pollingEventId: string,
    answers: Answer[]
}