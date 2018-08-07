import Record from "./Record";

/// 出金レコード（データ版）。
class RecordOutgo extends Record {
  account: number = 0; ///< 口座Id。
  category: number = 0; ///< 出金カテゴリId。
  amount: number = 0; ///< 金額。(出金がプラス・入金がマイナス)
}

export default RecordOutgo;
