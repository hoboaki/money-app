import Account from './Account'
import Category from './Category'
import RecordIncome from './RecordIncome';
import RecordOutgo from './RecordOutgo';
import RecordTransfer from './RecordTransfer';

/// ドキュメントルート。
class Root {
  /// 口座Idがキーの口座ハッシュ。
  accounts: {[key: number]: Account} = {};
  
  /// 入金。
  income: {
    categories: {[key: number]: Category}; ///< 入金カテゴリIdがキーの入金カテゴリハッシュ。
    records: {[key: number]: RecordIncome}; ///< 入金レコードIdがキーの入金レコード。
  } = {categories: {}, records: {},};

  /// 送金。
  outgo: {
    categories : {[key: number]: Category};///< 出金カテゴリIdがキーの出金カテゴリハッシュ。
    records: {[key: number]: RecordOutgo};  ///< 出金レコードIdがキーの出金レコード。
  } = {categories: {}, records: {},};

  /// 資金移動。
  transfer: {
    records: {[key: number]: RecordTransfer}; ///< 資金移動レコードIdがキーの資金移動レコード。
  } = {records: {}};

  /// 次に使用するId。
  nextId: {
    account: number;
    income: {
      category: number;
      record: number;
    };
    outgo: {
      category: number;
      record: number;
    };
    transfer: {
      record: number;
    };
  } = {
    account: 1,
    income: {category: 1, record: 1,},
    outgo: {category: 1, record: 1,},
    transfer: {record: 1},
  };
}

export default Root;
