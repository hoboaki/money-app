import Account from "./Account";
import Category from "./Category"
import Record from "./Record";

/// 入金レコード。
class RecordIncome extends Record {
  constructor(account: Account, category: Category) {
    super();
    this.account = account;
    this.category = category;
  }

  account: Account; // 口座。
  category: Category; // 入金カテゴリ。
  amount: number = 0; // 金額。(入金がプラス・出金がマイナス)
}

export default RecordIncome;
