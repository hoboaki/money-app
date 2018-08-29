import Account from './Account';
import Record from './Record';

/// 資金移動レコード。
class RecordTransfer extends Record {
  public accountFrom: Account; // 送金元口座。
  public accountTo: Account; // 送金先口座。
  public amount: number = 0; // 金額。

  constructor(accountFrom: Account, accountTo: Account) {
    super();
    this.accountFrom = accountFrom;
    this.accountTo = accountTo;
  }

}

export default RecordTransfer;
