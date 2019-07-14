import YearMonthDayDate from '../../utils/YearMonthDayDate';
import * as State from './State';

/**
 * 出金レコードの新規追加。
 * @param amount 金額。(出金がプラス・入金がマイナス)
 */
export const outgoRecordAddNew = (
  state: State.IState,
  date: YearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    date,
    memo,
    accountId,
    categoryId,
    amount,
  };

  // 追加
  obj.id = state.nextId.outgo.record;
  state.nextId.outgo.record++;
  state.outgo.records[obj.id] = obj;
  return obj.id;
};
