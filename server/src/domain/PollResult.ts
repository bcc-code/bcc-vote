export interface PollResultDetails {
    answerCount: Record<string, number>;
    lastChanged: number;
    pollId: string;
    pollingEventId: string;
    firestore: boolean;
}
