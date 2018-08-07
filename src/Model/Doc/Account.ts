/// 口座データ。
class Account {
  id: number = 0; ///< Id。
  name: string = ""; ///< 口座名。
  kind: string = ""; ///< 種類。
  initialAmount: number = 0; ///< プラスが貯蓄。マイナスが負債。
};

export default Account;
