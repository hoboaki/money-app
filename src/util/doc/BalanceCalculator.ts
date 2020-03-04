import * as StateMethods from 'src/state/doc/StateMethods';
import * as States from 'src/state/doc/States';

import IYearMonthDayDate from '../IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../IYearMonthDayDateUtils';
import RecordCollection from './RecordCollection';
import * as RecordFilters from './RecordFilters';

/** 残高を計算するクラス。 */
class BalanceCalculator {
  /** 口座 ID がキーの各講座の残高。 */
  public balances: { [key: number]: number } = {};
  public endDate: IYearMonthDayDate;
  private state: States.IState;
  private allRecords: RecordCollection | null = null;
  private futureRecords: RecordCollection | null = null;

  /**
   * コンストラクタ。
   * @param state データベース。
   * @param endDate 残高の決算日。この日の前日まで（この日を含めない）の残高を求める。null の場合は 99999年12月31日。
   * @param accounts 調査対象とする口座の AccountId 郡。null の場合は全口座が対象。
   * @param cache 計算結果を再利用するためのオブジェクト。endDate が cache.endDate より後ろの場合，このオブジェクトの結果を使って不要な計算処理をスキップする。
   */
  public constructor(
    state: States.IState,
    endDate: IYearMonthDayDate | null,
    accounts: number[] | null = null,
    cache: BalanceCalculator | null = null,
  ) {
    // 変数初期化
    this.state = state;
    if (endDate === null) {
      endDate = {
        year: 99999,
        month: 12,
        day: 31,
      };
    }
    this.endDate = endDate;
    this.allRecords = cache != null && cache.allRecords != null ? cache.allRecords : new RecordCollection(state);
    if (accounts == null) {
      accounts = StateMethods.basicAccountOrderMixed(state);
    }

    // 処理最適化のためまず日付で絞り込んでおく
    const allAccountCacheEnabled =
      cache != null &&
      accounts.filter((id) => id in cache.balances).length === accounts.length &&
      cache.endDate < this.endDate;
    const preCalculateStartDate: IYearMonthDayDate | null =
      cache != null && allAccountCacheEnabled ? cache.endDate : null;
    const srcRecords =
      cache != null && cache.futureRecords != null && preCalculateStartDate != null
        ? cache.futureRecords
        : this.allRecords;
    const preCalculateRecords = srcRecords.filter([
      RecordFilters.createDateRangeFilter({ startDate: preCalculateStartDate, endDate }),
    ]);
    this.futureRecords = srcRecords.filter([
      RecordFilters.createDateRangeFilter({ startDate: endDate, endDate: null }),
    ]);

    // レコードを各口座毎に振り分ける
    // RecordCollection.filter の機能を使うよりも更に高速化するためにカスタム実装する
    const accountDataMap: { [key: number]: { incomes: number[]; outgos: number[]; transfers: number[] } } = {};
    accounts.forEach((accountId) => {
      accountDataMap[accountId] = {
        incomes: [],
        outgos: [],
        transfers: [],
      };
    });
    preCalculateRecords.incomes.forEach((id) => {
      accountDataMap[this.state.income.records[id].account].incomes.push(id);
    });
    preCalculateRecords.outgos.forEach((id) => {
      accountDataMap[this.state.outgo.records[id].account].outgos.push(id);
    });
    preCalculateRecords.transfers.forEach((id) => {
      const record = this.state.transfer.records[id];
      accountDataMap[record.accountFrom].transfers.push(id);
      if (record.accountFrom !== record.accountTo) {
        // RecordFilter と挙動を合わせるために二重登録防止判定
        accountDataMap[record.accountTo].transfers.push(id);
      }
    });

    // 口座毎の結果を代入
    accounts.forEach((accountId) => {
      const accountData = accountDataMap[accountId];
      const records = new RecordCollection(state, {
        incomes: accountData.incomes,
        outgos: accountData.outgos,
        transfers: accountData.transfers,
      });
      const cacheBalance = cache != null && allAccountCacheEnabled ? cache.balances[accountId] : 0;
      const account = state.basicAccount.accounts[accountId];
      const addInitialAmount =
        IYearMonthDayDateUtils.less(account.startDate, this.endDate) &&
        (preCalculateStartDate == null || IYearMonthDayDateUtils.lessEq(preCalculateStartDate, account.startDate));
      const initialAmount = addInitialAmount ? account.initialAmount : 0;
      this.balances[accountId] =
        cacheBalance +
        initialAmount +
        records.sumAmountIncome() -
        records.sumAmountOutgo() +
        records.totalDiffTransfer([accountId]);
    });
  }

  /** 合計値を取得。 */
  public sumBalance() {
    return Object.values(this.balances).reduce((current, next) => current + next, 0);
  }
}
export default BalanceCalculator;
