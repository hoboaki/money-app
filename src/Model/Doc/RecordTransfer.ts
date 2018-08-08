import Account from "./Account"
import Record from "./Record";

/// 資金移動レコード。
class RecordTransfer extends Record {
  constructor(accountFrom: Account, accountTo: Account) {
    super();
    this.accountFrom = accountFrom;
    this.accountTo = accountTo;
  }
  
  accountFrom: Account; // 送金元口座。
  accountTo: Account; // 送金先口座。
  amount: number = 0; // 金額。
}

export default RecordTransfer;
