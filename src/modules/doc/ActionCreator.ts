import * as Action from './Action';

/**
 * 新しいタスクを作成するアクションを作成する
 * @param taskName 新しいタスクの名前
 * @param deadline 新しいタクスの期限
 */
export const createRecordOutgoAddAction = (
  date: string,
  category: string,
  price: number,
  memo: string,
  ): Action.IRecordOutgoAddAction => {
  return {
    type: Action.RECORD_OUTGO_ADD,
    date,
    category,
    price,
    memo,
  };
};
