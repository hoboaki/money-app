import YearMonthDayDate from '../../util/YearMonthDayDate';
import * as State from './States';

/**
 * 出金レコードの新規追加。
 * @param amount 金額。(出金がプラス・入金がマイナス)
 */
export const outgoRecordAddNew = (
  state: State.IState,
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
