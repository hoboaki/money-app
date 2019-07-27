import IYearMonthDayDate from '../../util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../../util/IYearMonthDayDateUtils';

/** レコード追加ダイアログ用 state。 */
export interface IDialogAddRecord {
  /** 追加後に続けて入力するか。 */
  isContinueMode: boolean;
}

/** PageHome 用 state。 */
export interface IPageHome {
  currentDate: IYearMonthDayDate;
}

/** State ルート。 */
export interface IState {
  dialogAddRecord: IDialogAddRecord;
  pageHome: IPageHome;
}

export const defaultState: IState = {
  dialogAddRecord: {
    isContinueMode: false,
  },
  pageHome : {
    currentDate: IYearMonthDayDateUtils.firstDayOfMonth(IYearMonthDayDateUtils.today()),
  },
};
