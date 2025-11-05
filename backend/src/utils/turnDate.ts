const shortMonths: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const turnDate = (date: Date) => {
  const day = date.getDate();
  const month = shortMonths[date.getMonth()];
  const year = date.getFullYear();
  const dateInString = `${day},${month},${year}`;
  return dateInString;
};
