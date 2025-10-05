import dayjs from '@app/lib/date-utils';

export const convertMinutesToHM = (minutes: number) => {
  const d = dayjs.duration(minutes, 'minutes');
  return `${d.hours()}h ${d.minutes()}m`;
};
