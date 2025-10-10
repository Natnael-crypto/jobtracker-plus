// utils/dateFormatter.ts
export function formatDateToReadable(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // invalid date safeguard

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Oct"
  const year = date.getFullYear();

  // ordinal suffix logic
  const getOrdinalSuffix = (n: number): string => {
    const j = n % 10,
      k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}
