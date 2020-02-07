/// 集計口座データ。
class AggregateAccount {
  public id: number = 0; // Id。
  public name: string = ''; // 口座名。
  public accounts: number[] = []; // 集計対象となる口座 Id の配列。
}

export default AggregateAccount;
