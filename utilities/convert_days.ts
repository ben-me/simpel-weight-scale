// App days start on mondays in the array which means monday has value of 0. JS starts with sunday as 0

export const toAppDayIndex = (jsDayIndex: number) => (jsDayIndex + 6) % 7;
