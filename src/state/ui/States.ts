import YearMonthDayDate from '../../util/YearMonthDayDate';

/** レコード追加ダイアログ用 state。 */
export interface IDialogAddRecord {
  /** 追加後に続けて入力するか。 */
  isContinueMode: boolean;
}

/** PageHome 用 state。 */
export interface IPageHome {
  currentDate: YearMonthDayDate;
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
    currentDate: new YearMonthDayDate().firstDayOfMonth(),
  },
};
