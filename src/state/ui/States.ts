import IYearMonthDayDate from '../../util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../../util/IYearMonthDayDateUtils';
import * as Types from './Types';

/** レコード追加ダイアログ用 state。 */
export interface IDialogAddRecord {
  dummy: boolean;
}

/** PageHome 用 state。 */
export interface IPageHome {
  currentDate: IYearMonthDayDate;
}

/** PageSheet 用 state。 */
export interface IPageSheet {
  currentDate: IYearMonthDayDate;
  viewUnit: Types.SheetViewUnit;
}

/** State ルート。 */
export interface IState {
  dialogAddRecord: IDialogAddRecord;
  pageHome: IPageHome;
  pageSheet: IPageSheet;
}

export const defaultState: IState = {
  dialogAddRecord: {
    dummy: false,
  },
  pageHome : {
    currentDate: IYearMonthDayDateUtils.firstDayOfMonth(IYearMonthDayDateUtils.today()),
  },
  pageSheet: {
    currentDate: IYearMonthDayDateUtils.today(),
    viewUnit: Types.SheetViewUnit.Day,
  },
};
