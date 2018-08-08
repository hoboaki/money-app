import Record from "./Record";

/// 入金レコードデータ。
class RecordIncome extends Record {
  account: number = 0; // 口座Id。
  category: number = 0; // 入金カテゴリId。
  amount: number = 0; // 金額。(入金がプラス・出金がマイナス)
}

export default RecordIncome;
