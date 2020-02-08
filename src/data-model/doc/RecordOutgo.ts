import Record from './Record';

/// 出金レコード（データ版）。
class RecordOutgo extends Record {
  public account = 0; // 口座Id。
  public category = 0; // 出金カテゴリId。
  public amount = 0; // 金額。(出金がプラス・入金がマイナス)
}

export default RecordOutgo;
