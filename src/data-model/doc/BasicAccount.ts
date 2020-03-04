/// 基本口座データ。
class BasicAccount {
  public id = 0; // Id。
  public name = ''; // 口座名。
  public kind = ''; // 種類。
  public initialAmount = 0; // プラスが貯蓄。マイナスが負債。
  public startDate = ''; // 口座開設日付。(YYYY-MM-DD形式)
}

export default BasicAccount;
