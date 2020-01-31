import * as States from 'src/state/doc/States';
import IYearMonthDayDate from '../IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../IYearMonthDayDateUtils';
import RecordCollection from './RecordCollection';
import * as RecordFilters from './RecordFilters';

/** 残高を計算するクラス。 */
class BalanceCalculator {
  /** 口座 ID がキーの各講座の残高。 */
  public balances: {[key: number]: number} = {};
  public endDate: IYearMonthDayDate;
  private state: States.IState;

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
    this.state = state;
    if (endDate === null) {
      endDate = {
        year: 99999,
        month: 12,
        day: 31,
      };
    }
    this.endDate = endDate;

    const allRecords = new RecordCollection(state);
    if (accounts == null) {
      accounts = state.account.order;
    }

    // 処理最適化のためまず日付で絞り込んでおく
    const allAccountCacheEnabled = cache != null &&
      accounts.filter((id) => id in cache.balances).length === accounts.length &&
      cache.endDate < this.endDate;
    const preCalculateStartDate: IYearMonthDayDate | null =
      (cache != null && allAccountCacheEnabled) ? cache.endDate : null;
    const preCalculateRangeFilterdRecords =
      allRecords.filter([
        RecordFilters.createDateRangeFilter({startDate: preCalculateStartDate, endDate}),
      ]);

    // 口座毎に計算
    accounts.forEach((accountId) => {
      const records = preCalculateRangeFilterdRecords.filter([
          RecordFilters.createAccountFilter({accounts: [accountId]}),
        ]);
      const cacheBalance = (cache != null && allAccountCacheEnabled) ? cache.balances[accountId] : 0;
      const account = state.account.accounts[accountId];
      const addInitialAmount = IYearMonthDayDateUtils.less(account.startDate, this.endDate) &&
        (preCalculateStartDate == null || IYearMonthDayDateUtils.lessEq(preCalculateStartDate, account.startDate));
      const initialAmount = addInitialAmount ? account.initialAmount : 0;
      this.balances[accountId] = cacheBalance + initialAmount +
        records.sumAmountIncome() - records.sumAmountOutgo() + records.totalDiffTransfer([accountId]);
    });
  }

  /** 合計値を取得。 */
  public sumBalance() {
    return Object.values(this.balances).reduce((current, next) => current + next, 0);
  }
}
export default BalanceCalculator;
