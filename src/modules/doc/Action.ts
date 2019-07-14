import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

/// 支出レコードの追加。
export const ADD_RECORD_OUTGO = UUID();
export interface IAddRecordOutgo extends Action {
  date: string;
  memo: string;
  accountId: number;
  categoryId: number;
  amount: number;
}
export const createAddRecordOutgo = (
  date: string,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ): IAddRecordOutgo => {
  return {
    type: ADD_RECORD_OUTGO,
    date,
    accountId,
    categoryId,
    amount,
    memo,
  };
};
