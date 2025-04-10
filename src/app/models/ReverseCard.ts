export type ReverseCard = {
  meaning: string;
  choices: {
    kanji: string;
    correct: boolean;
  }[];
}