import IYearMonthDayDate from './IYearMonthDayDate';

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

/** 今指している月の初日。 */
export const firstDayOfMonth = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month - 1, 1));
};

/** 今指している月の末日。 */
export const lastDayOfMonth = (date: IYearMonthDayDate): IYearMonthDayDate => {
  return fromDate(new Date(date.year, date.month, 0));
};

/** yyyy-mm-dd 形式に変換。 */
export const toText = (date: IYearMonthDayDate): string => {
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
  return `${year}-${month}-${day}`;
};

/** 日付が lhs < rhs か。 */
export const less = (lhs: IYearMonthDayDate, rhs: IYearMonthDayDate): boolean => {
  return (lhs.year * 372 + lhs.month * 31 + lhs.day) < (rhs.year * 372 + rhs.month * 31 + rhs.day);
};

/** 日付が lhs <= rhs か。 */
export const lessEq = (lhs: IYearMonthDayDate, rhs: IYearMonthDayDate): boolean => {
  return (lhs.year * 372 + lhs.month * 31 + lhs.day) <= (rhs.year * 372 + rhs.month * 31 + rhs.day);
};
