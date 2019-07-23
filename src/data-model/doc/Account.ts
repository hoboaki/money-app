/// 口座データ。
class Account {
  public id: number = 0; // Id。
  public name: string = ''; // 口座名。
  public kind: string = ''; // 種類。
  public initialAmount: number = 0; // プラスが貯蓄。マイナスが負債。
  public startDate: string = ''; // 口座開設日付。(YYYY-MM-DD形式)
}

export default Account;
