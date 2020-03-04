import AggregateAccount from './AggregateAccount';
import BasicAccount from './BasicAccount';
import Category from './Category';
import IncomeRecord from './IncomeRecord';
import OutgoRecord from './OutgoRecord';
import PalmCategoryInfo from './PalmCategoryInfo';
import TransferRecord from './TransferRecord';

/// ドキュメントルートデータ。
class Root {
  public accounts: BasicAccount[] = []; /// 全口座。

  public income: {
    categories: Category[]; /// 入金カテゴリの配列。
    records: IncomeRecord[]; /// 入金レコードの配列。
  } = { categories: [], records: [] };

  public outgo: {
    categories: Category[]; /// 出金カテゴリの配列。
    records: OutgoRecord[]; /// 出金レコードの配列。
  } = { categories: [], records: [] };

  public transfer: {
    records: TransferRecord[]; /// 資金移動レコードの配列。
  } = { records: [] };

  public aggregateAccounts: AggregateAccount[] = []; /// 全集計口座。

  public importTool: {
    palmCategories: {
      income: PalmCategoryInfo[];
      outgo: PalmCategoryInfo[];
    };
  } = { palmCategories: { income: [], outgo: [] } };
}

export default Root;
