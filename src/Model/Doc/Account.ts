import AccountKind from './AccountKind';

/// 口座。
class Account {
  public id: number = 0; // Id。
  public name: string = ''; // 口座名。
  public kind: AccountKind = AccountKind.Invalid; // 種類。
  public initialAmount: number = 0.0; // 初期金額。プラスが貯蓄。マイナスが負債。
}

export default Account;
