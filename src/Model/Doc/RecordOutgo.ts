import Account from "./Account"
import Category from "./Category";
import Record from "./Record";

/// 出金レコード。
class RecordOutgo extends Record {
  constructor(account: Account, category: Category) {
    super();
    this.account = account;
    this.category = category;
  }
  
  account: Account; ///< 口座。
  category: Category; ///< カテゴリ。
  amount: number = 0; ///< 金額。(出金がプラス・入金がマイナス)
}

export default RecordOutgo;
