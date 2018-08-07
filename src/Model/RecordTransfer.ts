import Account from "./Account"
import Record from "./Record";

/// 資金移動レコード。
class RecordTransfer extends Record {
  accountFrom: Account | null = null; ///< 送金元口座。
  accountTo: Account | null = null; ///< 送金先口座。
  amount: number = 0; ///< 金額。
}

export default RecordTransfer;
