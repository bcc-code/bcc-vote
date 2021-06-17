import { PollResultVisibility } from "./Poll";

export type Answer = {
    _id: string;
    _key: string;
    _from: string;
    _to: string;
    firestore?: boolean;
    visibility: PollResultVisibility
    answerId: string;
    pollingEventId: string;
    displayName: string;
}
