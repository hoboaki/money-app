import Account from "./Account";
import Category from "./Category";
import RecordIncome from "./RecordIncome";
import RecordOutgo from "./RecordOutgo";
import RecordTransfer from "./RecordTransfer";

/// ドキュメントルートデータ。
class Root {
  accounts: Account[] = []; ///< 全口座。
  
  income: {
    categories: Category[]; ///< 入金カテゴリの配列。
    records: RecordIncome[]; ///< 入金レコードの配列。
  } = {categories: [], records:[],};

  outgo: {
    categories: Category[]; ///< 出金カテゴリの配列。
    records: RecordOutgo[]; ///< 出金レコードの配列。
  } = {categories: [], records:[],};

  transfer: {
    records: RecordTransfer[]; ///< 資金移動レコードの配列。
  } = {records: [],};
};

export default Root;
