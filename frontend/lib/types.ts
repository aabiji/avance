export enum ExerciseType { Strength, HIIT }

export class Exercise {
  id: number = 0;
  weekDay: number = 0;
  name: string | undefined = undefined;
}

export class HIITExercise extends Exercise {
  workDuration: number | undefined = undefined;
  restDuration: number | undefined = undefined;
  rounds: number | undefined = undefined;

  constructor(weekDay: number) {
    super();
    this.weekDay = weekDay;
  }
}

export class StrengthExercise extends Exercise {
  reps: number | undefined = undefined;
  sets: number | undefined = undefined;
  weight: number | undefined = undefined;

  constructor(weekDay: number) {
    super();
    this.weekDay = weekDay;
  }
}

// Identical exercises have the same name, the same date and the same type
export function sameExercise(a: Exercise, b: Exercise): boolean {
  const x = a.rounds !== undefined;
  const y = b.rounds !== undefined;
  return a.name == b.name && a.weekDay == b.weekDay && x == y;
}