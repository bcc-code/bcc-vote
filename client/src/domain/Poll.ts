export interface Poll {
  _id: string,
  _key: string,
  title: string;
  description: string;
  answers: Answer[],
  activeStatus: number;
  resultVisibility: number;
}

export interface Answer {
  label: string,
  explanation: string,
  answerId: number,
}