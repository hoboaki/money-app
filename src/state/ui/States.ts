import IYearMonthDayDate from '../../util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../../util/IYearMonthDayDateUtils';
import * as Types from './Types';

/** レコード追加ダイアログ用 state。 */
export interface IDialogAddRecord {
  /** 追加後に続けて入力するか。 */
  isContinueMode: boolean;
}

/** PageHome 用 state。 */
export interface IPageHome {
  currentDate: IYearMonthDayDate;
}

/** PageSheet 用 state。 */
export interface IPageSheet {
  currentDate: IYearMonthDayDate;
  viewMode: Types.SheetViewMode;
}

/** State ルート。 */
export interface IState {
  dialogAddRecord: IDialogAddRecord;
  pageHome: IPageHome;
  pageSheet: IPageSheet;
}

export const defaultState: IState = {
  dialogAddRecord: {
    isContinueMode: false,
  },
  pageHome : {
    currentDate: IYearMonthDayDateUtils.firstDayOfMonth(IYearMonthDayDateUtils.today()),
  },
  pageSheet: {
    currentDate: IYearMonthDayDateUtils.today(),
    viewMode: Types.SheetViewMode.Day,
  },
};
