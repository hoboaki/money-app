import YearMonthDayDate from '../../util/YearMonthDayDate';

/** State ルート。 */
export interface IState {
  home: {
    currentDate: YearMonthDayDate,
  };
}

export const defaultState: IState = {
  home : {
    currentDate: new YearMonthDayDate(),
  },
};
