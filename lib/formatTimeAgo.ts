import * as timeago from 'timeago.js';
export function formatTimeAgo(messageTimestamp: string): string {
    const timeDifference = timeago.format(messageTimestamp, 'en_US');
    const [, value, unit] = /(\d+) (\w+)/.exec(timeDifference) || [];
    const unitMap: Record<string, string> = {
      years: 'y',
      year:'y',
      months: 'mo',
      weeks: 'w',
      days: 'd',
      hours: 'h',
      minutes: 'm',
      seconds: 's',

    };
    return `${value}${unitMap[unit] || unit}`;
  }
  