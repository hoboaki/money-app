import * as States from 'src/state/doc/States';
import * as Types from 'src/state/doc/Types';
import IYearMonthDayDate from '../IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../IYearMonthDayDateUtils';
import IRecordCollection from './IRecordCollection';
import IRecordFilter from './IRecordFilter';

/** 日付フィルタのデータ。 */
export interface IDateRangeFilterData {
  /** 開始日。この日以降（この日を含む）のレコードがヒットする。 null の場合は無期限。 */
  startDate: IYearMonthDayDate | null;
  /** 終了日。この日以前（この日を含まない）のレコードがヒットする。 null の場合は無制限。 */
  endDate: IYearMonthDayDate | null;
}

/** 日付フィルタを作成。 */
export const createDateRangeFilter = (data: IDateRangeFilterData): IRecordFilter => {
  return {
    filter: (collection: IRecordCollection, state: States.IState) => {
      let checkFunc: ((record: States.IRecord) => boolean) | null = null;

      // 比較演算が少しでも少なくなるようにチェック関数を場合分け
      if (data.startDate != null && data.endDate == null) {
        const startDate = data.startDate;
        checkFunc = (record) => {
          return IYearMonthDayDateUtils.lessEq(startDate, record.date);
        };
      } else if (data.startDate == null && data.endDate != null) {
        const endDate = data.endDate;
        checkFunc = (record) => {
          return IYearMonthDayDateUtils.less(record.date, endDate);
        };
      } else if (data.startDate != null && data.endDate != null) {
        const startDate = data.startDate;
        const endDate = data.endDate;
        checkFunc = (record) => {
          return IYearMonthDayDateUtils.lessEq(startDate, record.date) &&
            IYearMonthDayDateUtils.less(record.date, endDate);
        };
      }

      if (checkFunc != null) {
        return filteredCollection(collection, state, checkFunc);
      }
      return collection;
    },
  };
};

/** レコード種類フィルタのデータ。 */
export interface IRecordKindFilterData {
  /** 対象に含める RecordKind 。 */
  kinds: Types.RecordKind[];
}

/** レコード種類フィルタを作成。 */
export const createRecordKindFilter = (data: IRecordKindFilterData): IRecordFilter => {
  return {
    filter: (collection: IRecordCollection, state: States.IState) => {
      const income = data.kinds.includes(Types.RecordKind.Income);
      const outgo = data.kinds.includes(Types.RecordKind.Outgo);
      const transfer = data.kinds.includes(Types.RecordKind.Transfer);
      return filteredCollectionEach(
        collection,
        state,
        (record) => income,
        (record) => outgo,
        (record) => transfer,
      );
    },
  };
};

/** カテゴリフィルタのデータ。 */
export interface ICategoryFilterData {
  /** 対象たち。 categoryId に null を指定した場合は kind のレコード全てを対象とする。 */
  targets: Array<{kind: Types.RecordKind, categoryId: number | null}>;
}

/** レコード種類フィルタを作成。 */
export const createCategoryFilter = (data: ICategoryFilterData): IRecordFilter => {
  return {
    filter: (collection: IRecordCollection, state: States.IState) => {
      const incomeTargets = data.targets.filter((target) => target.kind === Types.RecordKind.Income)
        .map((target) => target.categoryId);
      const outgoTargets = data.targets.filter((target) => target.kind === Types.RecordKind.Outgo)
        .map((target) => target.categoryId);
      const transfer = data.targets.some((target) => target.kind === Types.RecordKind.Transfer);
      return filteredCollectionEach(
        collection,
        state,
        (record) => incomeTargets.includes(record.category),
        (record) => outgoTargets.includes(record.category),
        (record) => transfer,
      );
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
      const accountCount = state.account.order.length;
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

/** レコードIDフィルタのデータ。 */
export interface IRecordIdRangeFilterData {
  /** 最小値。このID以上のレコードがヒットする。 null の場合は無期限。 */
  startId: number | null;
  /** 末端値。このID未満のレコードがヒットする。 null の場合は無制限。 */
  endId: number | null;
}

/** レコードIDフィルタを作成。 */
export const createRecordIdRangeFilter = (data: IRecordIdRangeFilterData): IRecordFilter => {
  return {
    filter: (collection: IRecordCollection, state: States.IState) => {
      let checkFunc: ((record: States.IRecord) => boolean) | null = null;

      // 比較演算が少しでも少なくなるようにチェック関数を場合分け
      if (data.startId != null && data.endId == null) {
        const startId = data.startId;
        checkFunc = (record) => {
          return startId <= record.id;
        };
      } else if (data.startId == null && data.endId != null) {
        const endId = data.endId;
        checkFunc = (record) => {
          return record.id < endId;
        };
      } else if (data.startId != null && data.endId != null) {
        const startId = data.startId;
        const endId = data.endId;
        checkFunc = (record) => {
          return startId <=  record.id && record.id < endId;
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
