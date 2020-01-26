import IYearMonthDayDate from '../../util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../../util/IYearMonthDayDateUtils';
import * as Types from './Types';

/** ドキュメント操作用 state。 */
export interface IDocument {
  filePath: string;
  requestAutoSave: boolean;
}

/** レコード追加ダイアログ用 state。 */
export interface IDialogAddRecord {
  dummy: boolean;
}

/** PageCalendar 用 state。 */
export interface IPageCalendar {
  currentDate: IYearMonthDayDate;
}

/** PageSheet 用 state。 */
export interface IPageSheet {
  currentDate: IYearMonthDayDate;
  viewUnit: Types.SheetViewUnit;
}

/** State ルート。 */
export interface IState {
  document: IDocument;
  dialogAddRecord: IDialogAddRecord;
  pageCalendar: IPageCalendar;
  pageSheet: IPageSheet;
}

export const defaultState: IState = {
  document: {
    filePath: '',
    requestAutoSave: false,
  },
  dialogAddRecord: {
    dummy: false,
  },
  pageCalendar : {
    currentDate: IYearMonthDayDateUtils.firstDayOfMonth(IYearMonthDayDateUtils.today()),
  },
  pageSheet: {
    currentDate: IYearMonthDayDateUtils.today(),
    viewUnit: Types.SheetViewUnit.Day,
  },
};
