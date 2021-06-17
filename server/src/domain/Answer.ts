export type Answer = {
    _id: string;
    _key: string;
    _from: string;
    _to: string;
    firestore?: boolean;
    answerId: string;
    pollingEventId: string;
    displayName: string;
    churchName: string;
    visibility: string;
}