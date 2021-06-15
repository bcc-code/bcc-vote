export type Answer = {
    _id: string;
    _key: string;
    _from: string;
    _to: string;
    firestore?: boolean;
    answerId: number;
    pollingEventId: string;
    displayName: string;
    churchName: string;
}