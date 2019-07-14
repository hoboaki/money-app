import Clone from 'clone';
import Redux from 'redux';

import createA2RMapper from '../../utils/ActionToReducerMapper';
import * as Action from './Action';
import * as State from './State';
import * as StateMethod from './StateMethod';

const a2RMapper = createA2RMapper<State.IState>();

// タスクを追加する。
a2RMapper.addWork<Action.IAddRecordOutgo>(
    Action.ADD_RECORD_OUTGO,
    (state, action) => {
        StateMethod.outgoRecordAddNew(
          state,
          action.date,
          action.memo,
          action.accountId,
          action.categoryId,
          action.amount,
          );
    },
);

// Reducer 本体。
const Reducer: Redux.Reducer<State.IState> = (state = State.defaultState, action) => {
    return a2RMapper.execute(state, action);
};
export default Reducer;
