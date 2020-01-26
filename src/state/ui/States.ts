import IYearMonthDayDate from '../../util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../../util/IYearMonthDayDateUtils';
import * as Types from './Types';

/** 自動セーブ用 state。 */
export interface IAutoSaveManager {
  requestSave: boolean;
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
  autoSaveManager: IAutoSaveManager;
  dialogAddRecord: IDialogAddRecord;
  pageCalendar: IPageCalendar;
  pageSheet: IPageSheet;
}

export const defaultState: IState = {
  autoSaveManager: {
    requestSave: false,
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
