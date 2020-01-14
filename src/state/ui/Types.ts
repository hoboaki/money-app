import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';

/** Sheet 表示単位の種類。 */
export enum SheetViewUnit {
  Invalid = 0, // 無効値。
  Day = 1, // 日別。
  Month = 2, // 月間。
  Year = 3, // 年間。
}

/** SheetViewUnit -> IYearMonthDayDateUtils.Unit 変換関数。 */
export const sheetViewUnitToDateUnit = (viewUnit: SheetViewUnit) => {
  switch (viewUnit) {
    case SheetViewUnit.Day:
      return IYearMonthDayDateUtils.Unit.Day;
    case SheetViewUnit.Month:
      return IYearMonthDayDateUtils.Unit.Month;
    case SheetViewUnit.Year:
      return IYearMonthDayDateUtils.Unit.Year;
    default:
      return IYearMonthDayDateUtils.Unit.Invalid;
  }
};
