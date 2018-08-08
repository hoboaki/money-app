/// 口座データ。
class Account {
  public id: number = 0; // Id。
  public name: string = ''; // 口座名。
  public kind: string = ''; // 種類。
  public initialAmount: number = 0; // プラスが貯蓄。マイナスが負債。
}

export default Account;
