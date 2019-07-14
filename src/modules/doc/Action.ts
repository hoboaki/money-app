import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

/// 支出レコードの追加。
export const RECORD_OUTGO_ADD = UUID();

/// 支出レコードを追加するアクション。
export interface IRecordOutgoAddAction extends Action {
  date: string;
  category: string;
  price: number;
  memo: string;
}
