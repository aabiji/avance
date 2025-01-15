
export class HIITExercise {
  name: string | undefined = undefined;
  workDuration: number | undefined = undefined;
  restDuration: number | undefined = undefined;
  rounds: number | undefined = undefined;
}

export class StrengthExercise {
  name: string | undefined = undefined;
  reps: number | undefined = undefined;
  sets: number | undefined = undefined;
  weight: number | undefined = undefined;
}

export enum ExerciseType { Strength, HIIT }