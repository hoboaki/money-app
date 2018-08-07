import Account from "./Account";
import Category from "./Category"
import Record from "./Record";

/// 入金レコード。
class RecordIncome extends Record {
  account: Account | null = null; ///< 口座。
  category: Category | null = null; ///< 入金カテゴリ。
  amount: number = 0; ///< 金額。(入金がプラス・出金がマイナス)
}

export default RecordIncome;
