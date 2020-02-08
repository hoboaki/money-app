import * as States from 'src/state/doc/States';
import { RecordKind } from 'src/state/doc/Types';
import IYearMonthDayDate from '../IYearMonthDayDate';
import IRecordCollection from './IRecordCollection';
import IRecordFilter from './IRecordFilter';
import IRecordKey from './IRecordKey';
import IRecordOrder from './IRecordOrder';
import RecordOrderKind from './RecordOrderKind';

/** レコード群を扱うための便利クラス。 */
class RecordCollection implements IRecordCollection {
  public incomes: number[];
  public outgos: number[];
  public transfers: number[];
  private state: States.IState;

  /**
   * コンストラクタ。
   * @param state データベースとなる state。
   * @param src コレクション対象となるデータ群。 null を指定した場合は state の全レコードを使う。
   */
  public constructor(state: States.IState, src: IRecordCollection | null = null) {
    this.state = state;
    if (src != null) {
      this.incomes = src.incomes;
      this.outgos = src.outgos;
      this.transfers = src.transfers;
    } else {
      this.incomes = Object.values(state.income.records).map((rec) => rec.id);
      this.outgos = Object.values(state.outgo.records).map((rec) => rec.id);
      this.transfers = Object.values(state.transfer.records).map((rec) => rec.id);
    }
  }

  /** コレクションにおける入金レコードの総額を求める。 */
  public sumAmountIncome() {
    return this.incomes.reduce((current, id) => current + this.state.income.records[id].amount, 0);
  }

  /** コレクションにおける出金レコードの総額を求める。 */
  public sumAmountOutgo() {
    return this.outgos.reduce((current, id) => current + this.state.outgo.records[id].amount, 0);
  }

  /** コレクションにおける資金移動レコードの総額を求める。 */
  public sumAmountTransfer() {
    return this.transfers.reduce((current, id) => current + this.state.transfer.records[id].amount, 0);
  }

  /**
   * コレクションにおける振替レコードの差額を求める。
   * @param accounts 対象となる口座の AccountId。 null の場合は全口座。
   */
  public totalDiffTransfer(accounts: number[] | null = null) {
    let accountsDict: { [key: number]: any } = {};
    if (accounts != null) {
      accounts.forEach((id) => {
        accountsDict[id] = true;
      });
    } else {
      accountsDict = this.state.account.accounts;
    }
    return this.transfers.reduce((current, id) => {
      let result = current;
      const record = this.state.transfer.records[id];
      if (record.accountFrom in accountsDict) {
        result -= record.amount;
      }
      if (record.accountTo in accountsDict) {
        result += record.amount;
      }
      return result;
    }, 0);
  }

  /** フィルタにヒットするレコードだけを抽出したコレクションを返す。 */
  public filter(filters: IRecordFilter[]): RecordCollection {
    return new RecordCollection(
      this.state,
      filters.reduce((current, next) => next.filter(current, this.state), this as IRecordCollection),
    );
  }

  /** 標準的な並び順にソート済のレコードキー配列を返す。 */
  public standardSortedKeys() {
    return this.keys([
      { kind: RecordOrderKind.Date, reverse: false },
      { kind: RecordOrderKind.Category, reverse: false },
      { kind: RecordOrderKind.RecordId, reverse: false },
    ]);
  }

  /** 並び順を適用したレコードキー配列を返す。 */
  public keys(orders: IRecordOrder[]): IRecordKey[] {
    // Key 化
    let result: IRecordKey[] = [];
    result = result.concat(
      this.incomes.map<IRecordKey>((recordId) => {
        return {
          id: recordId,
          kind: RecordKind.Income,
        };
      }),
    );
    result = result.concat(
      this.outgos.map<IRecordKey>((recordId) => {
        return {
          id: recordId,
          kind: RecordKind.Outgo,
        };
      }),
    );
    result = result.concat(
      this.transfers.map<IRecordKey>((recordId) => {
        return {
          id: recordId,
          kind: RecordKind.Transfer,
        };
      }),
    );

    // ソート関数の用意
    const cmpFuncs: ((lhs: IRecordKey, rhs: IRecordKey) => number)[] = [];
    orders.forEach((order) => {
      switch (order.kind) {
        case RecordOrderKind.RecordId:
          cmpFuncs.push((lhs, rhs) => {
            if (lhs.id < rhs.id) {
              return order.reverse ? 1 : -1;
            }
            if (rhs.id < lhs.id) {
              return order.reverse ? -1 : 1;
            }
            return 0;
          });
          break;

        case RecordOrderKind.Date:
          cmpFuncs.push((lhs, rhs) => {
            const toNumFunc = (key: IRecordKey) => {
              let date: IYearMonthDayDate = { year: 0, month: 0, day: 0 };
              switch (key.kind) {
                case RecordKind.Income:
                  date = this.state.income.records[key.id].date;
                  break;
                case RecordKind.Outgo:
                  date = this.state.outgo.records[key.id].date;
                  break;
                case RecordKind.Transfer:
                  date = this.state.transfer.records[key.id].date;
                  break;
              }
              return date.day + date.month * 32 + date.year * 370;
            };
            const lhsNum = toNumFunc(lhs);
            const rhsNum = toNumFunc(rhs);
            if (lhsNum < rhsNum) {
              return order.reverse ? 1 : -1;
            }
            if (rhsNum < lhsNum) {
              return order.reverse ? -1 : 1;
            }
            return 0;
          });
          break;

        case RecordOrderKind.Category: {
          cmpFuncs.push((lhs, rhs) => {
            // まず RecordKind で比較
            if (lhs.kind !== rhs.kind) {
              const toNumFunc = (key: IRecordKey) => {
                switch (key.kind) {
                  case RecordKind.Income:
                    return 2;
                  case RecordKind.Outgo:
                    return 3;
                  case RecordKind.Transfer:
                    return 1;
                  default:
                    return 0;
                }
              };
              const lhsNum = toNumFunc(lhs);
              const rhsNum = toNumFunc(rhs);
              if (lhsNum < rhsNum) {
                return order.reverse ? 1 : -1;
              }
              if (rhsNum < lhsNum) {
                return order.reverse ? -1 : 1;
              }
              return 0;
            }

            // そうでなければカテゴリ順
            // ... （将来実装）
            return 0;
          });
          break;
        }
      }
    });

    // ソートを実行
    if (0 < cmpFuncs.length) {
      const cmpFunc = (lhs: IRecordKey, rhs: IRecordKey) => {
        for (const func of cmpFuncs) {
          const cmpResult = func(lhs, rhs);
          if (cmpResult !== 0) {
            return cmpResult;
          }
        }
        return 0;
      };
      result.sort(cmpFunc);
    }

    return result;
  }
}

export default RecordCollection;
