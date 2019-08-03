import * as States from 'src/state/doc/States';
import IRecordCollection from './IRecordCollection';
import IRecordFilter from './IRecordFilter';

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

  /**
   * コレクションにおける振替レコードの差額を求める。
   * @param accounts 対象となる口座の AccountId。 null の場合は全口座。
   */
  public totalDiffTransfer(accounts: number[] | null = null) {
    let accountsDict: {[key: number]: any} = {};
    if (accounts != null) {
      accounts.forEach((id) => {accountsDict[id] = true; });
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
}

export default RecordCollection;
