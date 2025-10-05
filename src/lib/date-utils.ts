import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isoWeek from 'dayjs/plugin/isoWeek';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isoWeek);
dayjs.extend(duration);

export default dayjs;
