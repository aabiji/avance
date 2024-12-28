// Get the current date in YYYY-MM-DD format
export const today = (): string =>
  new Date().toLocaleString("default").split(",")[0];

// Format a Date() in a compact way (YYYY-MM-DD) or a long way (Month Day, Year)
export function formatDate(date: Date, compact: boolean = false): string {
  if (compact) return date.toISOString().slice(0, 10);

  const fmt = date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
  return fmt.replace(".", ""); // Remove the dot at the end of the month name
}

// Get the ISO-8601 week number for a given date.
// The date is treated as UTC, ignoring local timezones.
// A week number is an index going from 1 to 52 (or 53 if it's a leap year).
function getISOWeekNumber(date: Date): number {
  const copy = new Date(date.getTime());

  // Get the day index (0 - 6), accounting for the difference
  // in the first day of the week. ISO-8601 says that Monday is
  // the first day of the week but Javascript says that Sunday
  // is the first day of the week
  const index = (copy.getUTCDay() + 6) % 7;

  // Get the date of the first thursday after today
  const nextThursday = new Date(copy.setUTCDate(copy.getUTCDate() - index + 3));

  // Get the date of the first thursday of the year
  const january1st = new Date(nextThursday.getUTCFullYear(), 0, 1);
  const janIndex = (january1st.getUTCDay() + 6) % 7;
  const firstThursday = new Date(
    january1st.setUTCDate(january1st.getUTCDate() - janIndex + 3),
  );

  // Get the week index
  const milisecondsPerWeek = 604800000;
  const diff = nextThursday.getTime() - firstThursday.getTime();
  return 1 + Math.ceil(diff / milisecondsPerWeek);
}

// Group a list of dates into weekly groups,
// where each group contains dates that fall within the same ISO week.
// The dates must already be sorted in ascending order.
export function groupDatesByWeek(dates: Date[]): Date[][] {
  let weeks = [];
  let currentWeek = [dates[0]];

  for (let i = 1; i < dates.length; i++) {
    const current = dates[i];
    const previous = currentWeek[currentWeek.length - 1];

    if (getISOWeekNumber(current) == getISOWeekNumber(previous)) {
      currentWeek.push(current);
      continue;
    }

    // Move on to the next week
    weeks.push(currentWeek);
    currentWeek = [current];
  }

  weeks.push(currentWeek);
  return weeks;
}
