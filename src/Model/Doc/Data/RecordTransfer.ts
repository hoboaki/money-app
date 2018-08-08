import Record from './Record';

/// 資金移動レコードデータ。
class RecordTransfer extends Record {
  public accountFrom: number = 0; // 送金元口座Id。amount が加算される。
  public accountTo: number = 0; // 送金先口座Id。amount が減算される。
  public amount: number = 0; // 金額。
}

export default RecordTransfer;
