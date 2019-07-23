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

/** 口座フィルタのデータ。 */
export interface IAccountFilterData {
  /** 対象に含める口座の AccountId 。 */
  accounts: number[];
}

/** 口座フィルタを作成。 */
export const createAccountFilter = (data: IAccountFilterData): IRecordFilter => {
  return {
    filter: (collection: IRecordCollection, state: States.IState) => {
      // 全口座の場合は結果は変わらないのでそのまま返す
      const accountCount = Object.keys(state.accounts).length;
      const targetAccountDict: {[key: number]: any} = {};
      const targetAccountCount = data.accounts.reduce((current, id) => {
        if (id in targetAccountDict) {
          return current;
        }
        targetAccountDict[id] = id;
        return current + 1;
      }, 0);
      if (accountCount === targetAccountCount) {
        return collection;
      }

      return filteredCollectionEach(
        collection,
        state,
        (record) => record.account in targetAccountDict,
        (record) => record.account in targetAccountDict,
        (record) => (record.accountFrom in targetAccountDict || record.accountTo in targetAccountDict),
      );
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

/** それぞれのレコード種別毎にフィルタを適用したコレクションを取得。 */
const filteredCollectionEach = (
  collection: IRecordCollection,
  state: States.IState,
  checkerIncome: (record: States.IRecordIncome) => boolean,
  checkerOutgo: (record: States.IRecordOutgo) => boolean,
  checkerTransfer: (record: States.IRecordTransfer) => boolean,
  ): IRecordCollection => {
  return {
    incomes: filteredArray<States.IRecordIncome>(collection.incomes, state.income.records, checkerIncome),
    outgos: filteredArray(collection.outgos, state.outgo.records, checkerOutgo),
    transfers: filteredArray(collection.transfers, state.transfer.records, checkerTransfer),
  };
};

/** フィルタを適用したレコード ID 配列を取得。 */
const filteredArray = <TRecord extends States.IRecord>(
  ids: number[],
  src: {[key: number]: TRecord},
  checker: (record: TRecord) => boolean,
  ): number[] => {
  return ids.filter((id) => {
    return checker(src[id]);
    });
};
