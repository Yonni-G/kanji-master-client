export type ClassicCard = {
  kanji: string;
  choices: {
    meaning: string;
    correct: boolean;
  }[];
}