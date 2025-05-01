// Extracts the date from searched before: and after: operators in YYYY-MM-DD format
export const parseTimeOperators = (searchInput?: string | null) => {
  // Invalid input returns the standard output with null values
  if(!searchInput) return { afterDate: null, beforeDate: null };
  // Pattern matches for determining if operators in input
  const beforeMatch = searchInput.match(/before:(\d{4}-\d{2}-\d{2})/);
  const afterMatch = searchInput.match(/after:(\d{4}-\d{2}-\d{2})/);
  // Assign matches
  const beforeDate = beforeMatch ? beforeMatch[1] : null;
  const afterDate = afterMatch ? afterMatch[1] : null;
  // Return object matched pattern or null
  return { afterDate, beforeDate };
}