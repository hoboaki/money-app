import Clone from 'clone';
import Redux from 'redux';

import createA2RMapper from '../../util/ActionToReducerMapper';
import * as Actions from './Actions';
import * as StateMethods from './StateMethods';
import * as States from './States';

const a2RMapper = createA2RMapper<States.IState>();

a2RMapper.addWork<Actions.IResetDocument>(
  Actions.RESET_DOCUMENT,
  (state, action) => {
    Object.assign(state, action.doc);
  },
);

a2RMapper.addWork<Actions.IAddRecordOutgo>(
    Actions.ADD_RECORD_OUTGO,
    (state, action) => {
        StateMethods.outgoRecordAdd(
          state,
          action.createDate,
          action.createDate, // 新規レコードなので更新日時は作成日時と同じでOK。
          action.date,
          action.memo,
          action.accountId,
          action.categoryId,
          action.amount,
          );
    },
);

// Reducer 本体。
const Reducer: Redux.Reducer<States.IState> = (state = States.defaultState, action) => {
    return a2RMapper.execute(state, action);
};
export default Reducer;
