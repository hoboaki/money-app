import Account from "./Account"
import Category from "./Category";
import Record from "./Record";

/// 出金レコード。
class RecordOutgo extends Record {
  account: Account | null = null; ///< 口座。
  category: Category | null = null; ///< カテゴリ。
  amount: number = 0; ///< 金額。(出金がプラス・入金がマイナス)
}

export default RecordOutgo;
