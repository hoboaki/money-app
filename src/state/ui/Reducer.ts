import Clone from 'clone';
import Redux from 'redux';
import { Action } from 'redux';

import createA2RMapper from '../../util/ActionToReducerMapper';
import * as Actions from './Actions';
import * as States from './States';

const a2RMapper = createA2RMapper<States.IState>();

a2RMapper.addWork<Action>(
  Actions.CALENDAR_MOVE_PREV,
  (state, action) => {
    state.home.currentDate = state.home.currentDate.prevMonth();
  },
);

a2RMapper.addWork<Action>(
  Actions.CALENDAR_MOVE_NEXT,
  (state, action) => {
    state.home.currentDate = state.home.currentDate.nextMonth();
  },
);

// Reducer 本体。
const Reducer: Redux.Reducer<States.IState> = (state = States.defaultState, action) => {
  return a2RMapper.execute(state, action);
};
export default Reducer;
