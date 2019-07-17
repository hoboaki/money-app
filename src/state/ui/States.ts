import YearMonthDayDate from '../../util/YearMonthDayDate';

/** PageHome 用 state。 */
export interface IPageHome {
  currentDate: YearMonthDayDate;
}

/** State ルート。 */
export interface IState {
  home: IPageHome;
}

export const defaultState: IState = {
  home : {
    currentDate: new YearMonthDayDate().firstDayOfMonth(),
  },
};
