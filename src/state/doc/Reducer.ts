import Redux from 'redux';
import createA2RMapper from 'src/util/ActionToReducerMapper';

import * as Actions from './Actions';
import * as StateMethods from './StateMethods';
import * as States from './States';

const a2RMapper = createA2RMapper<States.IState>();

a2RMapper.addWork<Actions.IResetDocument>(Actions.RESET_DOCUMENT, (state, action) => {
  Object.assign(state, action.doc);
});

a2RMapper.addWork<Actions.IAddBasicAccount>(Actions.ADD_BASIC_ACCOUNT, (state, action) => {
  StateMethods.basicAccountAdd(state, action.name, action.kind, action.initialAmount, action.startDate);
});

a2RMapper.addWork<Actions.IUpdateBasicAccount>(Actions.UPDATE_BASIC_ACCOUNT, (state, action) => {
  StateMethods.basicAccountUpdate(
    state,
    action.accountId,
    action.name,
    action.kind,
    action.initialAmount,
    action.startDate,
  );
});

a2RMapper.addWork<Actions.IAddAggregateAccount>(Actions.ADD_AGGREGATE_ACCOUNT, (state, action) => {
  StateMethods.aggregateAccountAdd(state, action.name, action.accounts);
});

a2RMapper.addWork<Actions.IUpdateAggregateAccount>(Actions.UPDATE_AGGREGATE_ACCOUNT, (state, action) => {
  StateMethods.aggregateAccountUpdate(state, action.accountId, action.name, action.accounts);
});

a2RMapper.addWork<Actions.IUpdateAccountOrder>(Actions.UPDATE_ACCOUNT_ORDER, (state, action) => {
  StateMethods.accountOrderUpdate(state, action.accountKind, action.oldIndex, action.newIndex);
});

a2RMapper.addWork<Actions.IDeleteAccount>(Actions.DELETE_ACCOUNT, (state, action) => {
  StateMethods.accountDelete(state, action.accountId);
});

a2RMapper.addWork<Actions.IAddCategory>(Actions.ADD_CATEGORY, (state, action) => {
  StateMethods.categoryAdd(state, action.kind, action.name, action.parentId);
});

a2RMapper.addWork<Actions.IUpdateCategory>(Actions.UPDATE_CATEGORY, (state, action) => {
  StateMethods.categoryUpdate(state, action.categoryId, action.name);
});

a2RMapper.addWork<Actions.IMoveCategory>(Actions.MOVE_CATEGORY, (state, action) => {
  StateMethods.categoryMove(state, action.categoryKind, action.categoryId, action.newParentId, action.newChildIndex);
});

a2RMapper.addWork<Actions.IDeleteCategory>(Actions.DELETE_CATEGORY, (state, action) => {
  StateMethods.categoryDelete(state, action.categoryId);
});

a2RMapper.addWork<Actions.IAddRecordIncome>(Actions.ADD_RECORD_INCOME, (state, action) => {
  StateMethods.incomeRecordAdd(
    state,
    action.createDate,
    action.createDate, // 新規レコードなので更新日時は作成日時と同じでOK。
    action.date,
    action.memo,
    action.accountId,
    action.categoryId,
    action.amount,
  );
});

a2RMapper.addWork<Actions.IUpdateRecordIncome>(Actions.UPDATE_RECORD_INCOME, (state, action) => {
  const record = state.income.records[action.recordId];
  if (record === undefined) {
    throw new Error(`Not found income record (recordId: ${action.recordId})`);
  }
  StateMethods.incomeRecordUpdate(
    state,
    action.recordId,
    record.createDate,
    action.updateDate,
    action.date,
    action.memo,
    action.accountId,
    action.categoryId,
    action.amount,
  );
});

a2RMapper.addWork<Actions.IAddRecordOutgo>(Actions.ADD_RECORD_OUTGO, (state, action) => {
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
});

a2RMapper.addWork<Actions.IUpdateRecordOutgo>(Actions.UPDATE_RECORD_OUTGO, (state, action) => {
  const record = state.outgo.records[action.recordId];
  if (record === undefined) {
    throw new Error(`Not found outgo record (recordId: ${action.recordId})`);
  }
  StateMethods.outgoRecordUpdate(
    state,
    action.recordId,
    record.createDate,
    action.updateDate,
    action.date,
    action.memo,
    action.accountId,
    action.categoryId,
    action.amount,
  );
});

a2RMapper.addWork<Actions.IAddRecordTransfer>(Actions.ADD_RECORD_TRANSFER, (state, action) => {
  StateMethods.transferRecordAdd(
    state,
    action.createDate,
    action.createDate, // 新規レコードなので更新日時は作成日時と同じでOK。
    action.date,
    action.memo,
    action.accountFromId,
    action.accountToId,
    action.amount,
  );
});

a2RMapper.addWork<Actions.IUpdateRecordTransfer>(Actions.UPDATE_RECORD_TRANSFER, (state, action) => {
  const record = state.transfer.records[action.recordId];
  if (record === undefined) {
    throw new Error(`Not found transfer record (recordId: ${action.recordId})`);
  }
  StateMethods.transferRecordUpdate(
    state,
    action.recordId,
    record.createDate,
    action.updateDate,
    action.date,
    action.memo,
    action.accountFromId,
    action.accountToId,
    action.amount,
  );
});

a2RMapper.addWork<Actions.IDeleteRecords>(Actions.DELETE_RECORDS, (state, action) => {
  StateMethods.deleteRecords(state, action.records);
});

a2RMapper.addWork<Actions.IUpdateCategoryCollapse>(Actions.UPDATE_CATEGORY_COLLAPSE, (state, action) => {
  StateMethods.categoryCollapsedStateUpdate(state, action.categoryId, action.isCollapsed);
});

a2RMapper.addWork<Actions.IAddPalmCategoryInfoIncome>(Actions.ADD_PALM_CATEGORY_INFO_INCOME, (state, action) => {
  StateMethods.palmCategoryInfoIncomeAdd(state, action.name, action.accountId, action.categoryId);
});

a2RMapper.addWork<Actions.IAddPalmCategoryInfoOutgo>(Actions.ADD_PALM_CATEGORY_INFO_OUTGO, (state, action) => {
  StateMethods.palmCategoryInfoOutgoAdd(state, action.name, action.accountId, action.categoryId);
});

// Reducer 本体。
const Reducer: Redux.Reducer<States.IState> = (state = States.defaultState, action) => {
  return a2RMapper.execute(state, action);
};
export default Reducer;
