import Account from './Account';
import Category from './Category';
import Record from './Record';

/// 入金レコード。
class RecordIncome extends Record {
  public account: Account; // 口座。
  public category: Category; // 入金カテゴリ。
  public amount: number = 0; // 金額。(入金がプラス・出金がマイナス)

  constructor(account: Account, category: Category) {
    super();
    this.account = account;
    this.category = category;
  }

}

export default RecordIncome;
