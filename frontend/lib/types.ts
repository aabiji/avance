export interface HIITExercise {
  name: string;
  workDuration: number,
  restDuration: number,
  rounds: number,
}

export interface StrengthExercise {
  name: string;
  reps: number;
  sets: number;
  weight: number;
}

export type Exercise = HIITExercise | StrengthExercise;

export enum ExerciseType { Strength, HIIT }