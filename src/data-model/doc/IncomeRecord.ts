import Record from './Record';

/// 入金レコードデータ。
class IncomeRecord extends Record {
  public account = 0; // 口座Id。
  public category = 0; // 入金カテゴリId。
  public amount = 0; // 金額。(入金がプラス・出金がマイナス)
}

export default IncomeRecord;
