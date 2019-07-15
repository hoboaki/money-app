import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

import YearMonthDayDate from '../../util/YearMonthDayDate';

/// 支出レコードの追加。
export const ADD_RECORD_OUTGO = UUID();
export interface IAddRecordOutgo extends Action {
  date: YearMonthDayDate;
  memo: string;
  accountId: number;
  categoryId: number;
  amount: number;
}
export const addRecordOutgo = (
  date: YearMonthDayDate,
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
