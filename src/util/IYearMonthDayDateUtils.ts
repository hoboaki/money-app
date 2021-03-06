import IYearMonthDayDate from './IYearMonthDayDate';

/** 単位。. */
export enum Unit {
  Invalid = 0, // 無効値。
  Day = 1, // 日。
  Month = 2, // 月。
  Year = 3, // 年。
}

/** 今日で作成。 */
export const today = (): IYearMonthDayDate => {
  return fromDate(new Date());
};

/** Date オブジェクトから作成。 */
export const fromDate = (nativeDate: Date): IYearMonthDayDate => {
  return {
    year: nativeDate.getFullYear(),
    month: nativeDate.getMonth() + 1,
    day: nativeDate.getDate(),
  };
};

/** YYYY-MM-DD 形式のテキストから作成。 */
export const fromText = (text: string): IYearMonthDayDate => {
  return fromDate(new Date(text));
};

/** Date に変換。（時刻は0時0分0秒） */
export const toNativeDate = (date: IYearMonthDayDate): Date => {
  return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
};

/** 前年の初日。 */
export const prevYear = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year - 1, 0, 1));
};

/** 翌年の初日。 */
export const nextYear = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year + 1, 0, 1));
};

/** 前月の初日。 */
export const prevMonth = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month - 2, 1));
};

/** 翌月の初日。 */
export const nextMonth = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month, 1));
};

/** 前日。 */
export const prevDay = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month - 1, date.day - 1));
};

/** 翌日。 */
export const nextDay = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month - 1, date.day + 1));
};

/** 曜日（0:日曜日，6:土曜日） */
export const dow = (date: IYearMonthDayDate): number => {
  return toNativeDate(date).getDay();
};

/** 日本語化された曜日（'日','月',...） */
export const localaizedDow = (date: IYearMonthDayDate): string => {
  switch (dow(date)) {
    case 0:
      return '日';
    case 1:
      return '月';
    case 2:
      return '火';
    case 3:
      return '水';
    case 4:
      return '木';
    case 5:
      return '金';
    case 6:
      return '土';
    default:
      return '#';
  }
};

/** 今指している年の初日。 */
export const firstDayOfYear = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, 0, 1));
};

/** 今指している年の末日。 */
export const lastDayOfYear = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year + 1, 0, 0));
};

/** 今指している月の初日。 */
export const firstDayOfMonth = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month - 1, 1));
};

/** 今指している月の末日。 */
export const lastDayOfMonth = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month, 0));
};

/** 前の日付。 */
export const prevDate = (date: IYearMonthDayDate, unit: Unit): IYearMonthDayDate => {
  switch (unit) {
    case Unit.Day:
      return prevDay(date);
    case Unit.Month:
      return prevMonth(date);
    case Unit.Year:
      return prevYear(date);
    default:
      return date;
  }
};

/** 次の日付。 */
export const nextDate = (date: IYearMonthDayDate, unit: Unit): IYearMonthDayDate => {
  switch (unit) {
    case Unit.Day:
      return nextDay(date);
    case Unit.Month:
      return nextMonth(date);
    case Unit.Year:
      return nextYear(date);
    default:
      return date;
  }
};

/** yyyy-mm-dd 形式に変換。 */
export const toDataFormatText = (date: IYearMonthDayDate): string => {
  return toText(date, '-');
};

/** yyyy/mm/dd 形式に変換。 */
export const toDisplayFormatText = (date: IYearMonthDayDate): string => {
  return toText(date, '/');
};

/** yyyysmmsdd 形式に変換。(s: separator） */
export const toText = (date: IYearMonthDayDate, separator: string): string => {
  const toDoubleDigits = (num: number) => {
    let text = String(num);
    if (text.length === 1) {
      text = '0' + text;
    }
    return text;
  };
  const year = date.year;
  const month = toDoubleDigits(date.month);
  const day = toDoubleDigits(date.day);
  return `${year}${separator}${month}${separator}${day}`;
};

/** 日付が lhs < rhs か。 */
export const less = (lhs: IYearMonthDayDate, rhs: IYearMonthDayDate): boolean => {
  return lhs.year * 372 + lhs.month * 31 + lhs.day < rhs.year * 372 + rhs.month * 31 + rhs.day;
};

/** 日付が lhs <= rhs か。 */
export const lessEq = (lhs: IYearMonthDayDate, rhs: IYearMonthDayDate): boolean => {
  return lhs.year * 372 + lhs.month * 31 + lhs.day <= rhs.year * 372 + rhs.month * 31 + rhs.day;
};
