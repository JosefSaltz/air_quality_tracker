export type TimeOptionKey = keyof typeof timeOptions;
export const timeOptions = {
    'Today': { name: "Today", days: 1 },
    'Week': { name: "Week", days: 7 },
    'Month': { name: "Month", days: 30 },
    'All': { name: 'All', days: true},
    'Custom': { name: "Custom", days: false }
  } as const;