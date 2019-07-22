import Clone from 'clone';
import YearMonthDayDate from '../../util/YearMonthDayDate';
import * as States from './States';
import * as Types from './Types';

/** フィルタインターフェース。 */
export interface IFilter {
  filter: (collection: IRecordCollection, state: States.IState) => IRecordCollection;
}

/** 日付フィルタのデータ。 */
export interface IDateRangeFilterData {
  /** 開始日。この日以降（この日を含む）のレコードがヒットする。 null の場合は無期限。 */
  startDate: YearMonthDayDate | null;
  /** 終了日。この日以前（この日を含まない）のレコードがヒットする。 null の場合は無制限。 */
  endDate: YearMonthDayDate | null;
}

/** 日付フィルタを作成。 */
export const createDateRangeFilter = (data: IDateRangeFilterData): IFilter => {
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

/** レコードの全種類を扱える間接参照。 */
export interface IRecordReference {
  /** レコードの種類。 */
  kind: Types.RecordKind;
  /** レコードID。 */
  id: number;
}

/** レコード群を扱うコレクションオブジェクト。 */
export interface IRecordCollection {
  incomes: number[];
  outgos: number[];
  transfers: number[];
}

/** Collection　の中にあるレコードから検索をする。 */
export const findInCollection = (
  collection: IRecordCollection,
  state: States.IState,
  filters: IFilter[],
  ): IRecordCollection => {
  return filters.reduce((current, next) => next.filter(current, state), collection);
};

/** State の中にある全レコードから検索をする。 */
export const findInState = (state: States.IState, filters: IFilter[]): IRecordCollection => {
  return findInCollection(
    {
      incomes: Object.values(state.income.records).map((rec) => rec.id),
      outgos: Object.values(state.outgo.records).map((rec) => rec.id),
      transfers: Object.values(state.transfer.records).map((rec) => rec.id),
    },
    state,
    filters,
  );
};

/** コレクションの複製。 */
const cloneCollection = (collection: IRecordCollection): IRecordCollection => {
  return Clone(collection);
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
