import Account from './Account';
import Category from './Category';
import Record from './Record';

/// 出金レコード。
class RecordOutgo extends Record {
  public account: Account; // 口座。
  public category: Category; // カテゴリ。
  public amount: number = 0; // 金額。(出金がプラス・入金がマイナス)

  constructor(account: Account, category: Category) {
    super();
    this.account = account;
    this.category = category;
  }

}

export default RecordOutgo;
