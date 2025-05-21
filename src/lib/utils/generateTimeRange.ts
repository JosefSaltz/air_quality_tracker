import {today, getLocalTimeZone} from "@internationalized/date"
import type { TimeOptionKey } from "@/lib/constants";
export function generateTimeRange(selectedTime: TimeOptionKey) {
    // Simplest return first
    if(selectedTime === 'Custom') return;
    const todayCalDate = today(getLocalTimeZone());
    if(selectedTime === 'Today') return { end: todayCalDate, start: todayCalDate, days: 0 };
    if(selectedTime === 'Week') return { end: todayCalDate, start: todayCalDate.subtract({ days: 7 }), days: 7 };
    if(selectedTime === 'Month') return { end: todayCalDate, start: todayCalDate.subtract({ days: 30 }), days: 30 };
  }