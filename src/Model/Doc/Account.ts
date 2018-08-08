import AccountKind from './AccountKind'

/// 口座。
class Account {
  id : number = 0; // Id。
  name : string = ""; // 口座名。
  kind : AccountKind = AccountKind.Invalid; // 種類。
  initialAmount : number = 0.0; // 初期金額。プラスが貯蓄。マイナスが負債。
};

export default Account;
