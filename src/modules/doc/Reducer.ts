import Clone from 'clone';
import Redux from 'redux';

import createA2RMapper from '../../utils/ActionToReducerMapper';
import * as Action from './Action';
import * as State from './State';

const a2RMapper = createA2RMapper<State.IState>();

// タスクを追加する。
a2RMapper.addWork<Action.IRecordOutgoAddAction>(
    Action.RECORD_OUTGO_ADD,
    (state, action) => {
        state.hoge = 1;
    },
);

// Reducer 本体。
const Reducer: Redux.Reducer<State.IState> = (state = State.defaultState, action) => {
    return a2RMapper.execute(state, action);
};
export default Reducer;
