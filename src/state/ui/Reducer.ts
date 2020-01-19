import Clone from 'clone';
import Redux from 'redux';
import { Action } from 'redux';

import createA2RMapper from 'src/util/ActionToReducerMapper';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as Actions from './Actions';
import * as States from './States';
import * as Types from './Types';

const a2RMapper = createA2RMapper<States.IState>();

a2RMapper.addWork<Action>(
  Actions.CALENDAR_MOVE_PREV,
  (state, action) => {
    state.pageHome.currentDate = IYearMonthDayDateUtils.prevMonth(state.pageHome.currentDate);
  },
);

a2RMapper.addWork<Action>(
  Actions.CALENDAR_MOVE_NEXT,
  (state, action) => {
    state.pageHome.currentDate = IYearMonthDayDateUtils.nextMonth(state.pageHome.currentDate);
  },
);

a2RMapper.addWork<Action>(
  Actions.CALENDAR_MOVE_TODAY,
  (state, action) => {
    state.pageHome.currentDate = IYearMonthDayDateUtils.firstDayOfMonth(IYearMonthDayDateUtils.today());
  },
);

a2RMapper.addWork<Action>(
  Actions.SHEET_MOVE_PREV,
  (state, action) => {
    state.pageSheet.currentDate = IYearMonthDayDateUtils.prevDate(
      state.pageSheet.currentDate,
      Types.sheetViewUnitToDateUnit(state.pageSheet.viewUnit));
  },
);

a2RMapper.addWork<Action>(
  Actions.SHEET_MOVE_NEXT,
  (state, action) => {
    state.pageSheet.currentDate = IYearMonthDayDateUtils.nextDate(
      state.pageSheet.currentDate,
      Types.sheetViewUnitToDateUnit(state.pageSheet.viewUnit));
  },
);

const pageSheetSetDate = (state: States.IState, date: IYearMonthDayDate) => {
  switch (state.pageSheet.viewUnit) {
    case Types.SheetViewUnit.Day:
      state.pageSheet.currentDate = date;
      break;
    case Types.SheetViewUnit.Month:
      state.pageSheet.currentDate = IYearMonthDayDateUtils.firstDayOfMonth(date);
      break;
    case Types.SheetViewUnit.Year:
      state.pageSheet.currentDate = IYearMonthDayDateUtils.firstDayOfYear(date);
      break;
  }
};

a2RMapper.addWork<Action>(
  Actions.SHEET_MOVE_TODAY,
  (state, action) => {
    pageSheetSetDate(state, IYearMonthDayDateUtils.today());
  },
);

a2RMapper.addWork<Actions.ISheetChangeViewUnit>(
  Actions.SHEET_CHANGE_VIEW_UNIT,
  (state, action) => {
    state.pageSheet.viewUnit = action.viewUnit;
    pageSheetSetDate(state, state.pageSheet.currentDate);
  },
);

// Reducer 本体。
const Reducer: Redux.Reducer<States.IState> = (state = States.defaultState, action) => {
  return a2RMapper.execute(state, action);
};
export default Reducer;
