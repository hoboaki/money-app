import YearMonthDayDate from '../../util/YearMonthDayDate';
import * as States from './States';
import * as Types from './Types';

/**
 * 口座追加。
 * @return {number} 追加した口座のId。
 */
export const accountAdd = (
  state: States.IState,
  name: string,
  kind: Types.AccountKind,
  initialAmount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    name,
    kind,
    initialAmount,
  };

  // 追加
  obj.id = state.nextId.account;
  state.nextId.account++;
  state.accounts[obj.id] = obj;
  return obj.id;
};

/// 出金カテゴリ追加。
/// @return {number} 追加したカテゴリの CategoryId。
export const outgoCategoryAdd = (
  state: States.IState,
  name: string,
  parentId: number | null,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    name,
    parent: parentId,
    childs: [],
  };
  const parent = parentId != null ? state.outgo.categories[parentId] : null;

  // 追加
  obj.id = state.nextId.outgo.category;
  state.nextId.outgo.category++;
  state.outgo.categories[obj.id] = obj;
  if (parentId != null) {
    if (parent != null) {
      parent.childs.push(obj.id);
    } else {
      global.console.assert(false);
    }
  }
  return obj.id;
};

/**
 * 出金レコードの新規追加。
 * @param amount 金額。(出金がプラス・入金がマイナス)
 */
export const outgoRecordAddNew = (
  state: States.IState,
  createDate: Date,
  date: YearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ) => {
  global.console.log('Called outgoRecordAddNew');

  // オブジェクト作成
  const obj = {
    id: 0,
    createDate,
    updateDate: createDate,
    date,
    memo,
    account: accountId,
    category: categoryId,
    amount,
  };

  // 追加
  obj.id = state.nextId.outgo.record;
  state.nextId.outgo.record++;
  state.outgo.records[obj.id] = obj;
  return obj.id;
};
