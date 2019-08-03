import Clone from 'clone';
import Redux from 'redux';
import { Action } from 'redux';

import createA2RMapper from 'src/util/ActionToReducerMapper';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as Actions from './Actions';
import * as States from './States';

const a2RMapper = createA2RMapper<States.IState>();

a2RMapper.addWork<Actions.IDialogAddRecordSetContinueMode>(
  Actions.DIALOG_ADD_RECORD_SET_CONTINUE_MODE,
  (state, action) => {
    state.dialogAddRecord.isContinueMode = action.isContinueMode;
  },
);

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

// Reducer 本体。
const Reducer: Redux.Reducer<States.IState> = (state = States.defaultState, action) => {
  return a2RMapper.execute(state, action);
};
export default Reducer;
