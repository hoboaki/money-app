import * as States from '../../state/doc/States';
import YearMonthDayDate from '../YearMonthDayDate';
import IRecordCollection from './IRecordCollection';
import IRecordFilter from './IRecordFilter';

/** 日付フィルタのデータ。 */
export interface IDateRangeFilterData {
  /** 開始日。この日以降（この日を含む）のレコードがヒットする。 null の場合は無期限。 */
  startDate: YearMonthDayDate | null;
  /** 終了日。この日以前（この日を含まない）のレコードがヒットする。 null の場合は無制限。 */
  endDate: YearMonthDayDate | null;
}

/** 日付フィルタを作成。 */
export const createDateRangeFilter = (data: IDateRangeFilterData): IRecordFilter => {
  return {
    filter: (collection: IRecordCollection, state: States.IState) => {
      let checkFunc: ((record: States.IRecord) => boolean) | null = null;

      // 比較演算が少しでも少なくなるようにチェック関数を場合分け
      if (data.startDate != null && data.endDate == null) {
        const startDate = data.startDate.date;
        checkFunc = (record) => {
          return startDate <= record.date.date;
        };
      } else if (data.startDate == null && data.endDate != null) {
        const endDate = data.endDate.date;
        checkFunc = (record) => {
          return record.date.date < endDate;
        };
      } else if (data.startDate != null && data.endDate != null) {
        const startDate = data.startDate.date;
        const endDate = data.endDate.date;
        checkFunc = (record) => {
          return startDate <= record.date.date && record.date.date < endDate;
        };
      }

      if (checkFunc != null) {
        return filteredCollection(collection, state, checkFunc);
      }
      return collection;
    },
  };
};

/** フィルタを適用したコレクションを取得。 */
const filteredCollection = (
  collection: IRecordCollection,
  state: States.IState,
  checker: (record: States.IRecord) => boolean,
  ): IRecordCollection => {
  return {
    incomes: filteredArray(collection.incomes, state.income.records, checker),
    outgos: filteredArray(collection.outgos, state.outgo.records, checker),
    transfers: filteredArray(collection.transfers, state.transfer.records, checker),
  };
};

/** フィルタを適用したレコード ID 配列を取得。 */
const filteredArray = <TRecord extends States.IRecord>(
  ids: number[],
  src: {[key: number]: TRecord},
  checker: (record: States.IRecord) => boolean,
  ): number[] => {
  return ids.filter((id) => {
    return checker(src[id]);
    });
};
