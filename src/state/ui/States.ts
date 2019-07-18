import YearMonthDayDate from '../../util/YearMonthDayDate';

/** PageHome 用 state。 */
export interface IPageHome {
  currentDate: YearMonthDayDate;
}

/** State ルート。 */
export interface IState {
  pageHome: IPageHome;
}

export const defaultState: IState = {
  pageHome : {
    currentDate: new YearMonthDayDate().firstDayOfMonth(),
  },
};
