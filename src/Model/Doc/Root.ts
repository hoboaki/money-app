import Account from './Account';
import AccountKind from './AccountKind';
import Category from './Category';
import DataAccount from './Data/Account';
import DataCategory from './Data/Category';
import DataRecordIncome from './Data/RecordIncome';
import DataRoot from './Data/Root';
import RecordIncome from './RecordIncome';
import RecordOutgo from './RecordOutgo';
import RecordTransfer from './RecordTransfer';
import YearMonthDayDate from './YearMonthDayDate';

/// ドキュメントルート。
class Root {
  /// DataRoot から作成。
  public static FromData(aData: DataRoot) {
    // enum デシリアライズ
    const enumPraseAccounntKind = (targetKey: string): AccountKind => {
      for (const key in AccountKind) {
        if (key === targetKey) {
          return (+AccountKind[key]) as AccountKind;
        }
      }
      throw new Error(`Error: Not found key named '${targetKey}'.`);
    };

    // 結果
    const r = new Root();

    //  口座
    const accountIdDict: {[key: number]: number} = {}; // Data内Id → オブジェクトId 変換テーブル
    for (const data of aData.accounts) {
      const kind = enumPraseAccounntKind(data.kind);
      const key = r.accountAdd(data.name, kind, data.initialAmount);
      accountIdDict[data.id] = key;
    }

    // 入金
    {
        const categoryIdDict: {[key: number]: number} = {}; // Data内Id -> オブジェクトId 変換テーブル
        for (const data of aData.income.categories) {
          let parentId = 0;
          if (data.parent !== 0) {
              parentId = categoryIdDict[data.parent];
              if (parentId == null) {
                  throw new Error(`Error: Invalid parent value(${data.parent}) in income category (id: '${data.id}').`);
              }
          }
          const key = r.incomeCategoryAdd(data.name, r.income.categories[parentId]);
          categoryIdDict[data.id] = key;
        }
        for (const data of aData.income.records) {
          const categoryId = categoryIdDict[data.category];
          if (categoryId == null) {
              throw new Error(`Error: Invalid category value(${data.category}) in income record.`);
          }
          const accountId = accountIdDict[data.account];
          if (accountId == null) {
              throw new Error(`Error: Invalid account value(${data.account}) in income record.`);
          }
          r.incomeRecordAdd(
            YearMonthDayDate.FromText(data.date),
            data.memo,
            r.accounts[accountId],
            r.income.categories[categoryId],
            data.amount,
          );
        }
    }

    return r;
  }

  /// 口座Idがキーの口座ハッシュ。
  public accounts: {[key: number]: Account} = {};

  /// 入金。
  public income: {
    categories: {[key: number]: Category}; // 入金カテゴリIdがキーの入金カテゴリハッシュ。
    records: {[key: number]: RecordIncome}; // 入金レコードIdがキーの入金レコード。
  } = {categories: {}, records: {}};

  /// 送金。
  public outgo: {
    categories: {[key: number]: Category}; // 出金カテゴリIdがキーの出金カテゴリハッシュ。
    records: {[key: number]: RecordOutgo}; // 出金レコードIdがキーの出金レコード。
  } = {categories: {}, records: {}};

  /// 資金移動。
  public transfer: {
    records: {[key: number]: RecordTransfer}; // 資金移動レコードIdがキーの資金移動レコード。
  } = {records: {}};

  /// 次に使用するId。
  private nextId: {
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
    income: {category: 1, record: 1},
    outgo: {category: 1, record: 1},
    transfer: {record: 1},
  };

  /// ドキュメントルートデータにエクスポート。
  public toData() {
    // 結果オブジェクト
    const result = new DataRoot();

    // 口座
    for (const key in this.accounts) {
      const src = this.accounts[key];
      const data = new DataAccount();
      data.id = src.id;
      data.name = src.name;
      data.kind = AccountKind[src.kind];
      result.accounts.push(data);
      data.initialAmount = src.initialAmount;
    }

    // 入金
    {
      // カテゴリ
      for (const key in this.income.categories) {
        const src = this.income.categories[key];
        const data = new DataCategory();
        data.id = src.id;
        data.name = src.name;
        if (src.parent != null) {
          data.parent = src.parent.id;
        }
        result.income.categories.push(data);
      }

      // レコード
      for (const key in this.income.records) {
        const src = this.income.records[key];
        const data = new DataRecordIncome();
        data.date = src.date.toText();
        data.memo = src.memo;
        data.amount = src.amount;
        data.category = src.category.id;
        data.account = src.account.id;
        result.income.records.push(data);
      }
    }

    // 結果を返す
    return result;
  }

  /// 口座追加。
  /// @return {number} 追加した口座のId。
  public accountAdd(aName: string, aKind: AccountKind, aInitialAmount: number) {
    // オブジェクト作成
    const obj = new Account();
    obj.name = aName;
    obj.kind = aKind;
    obj.initialAmount = aInitialAmount;

    // 追加
    obj.id = this.nextId.account;
    this.nextId.account++;
    this.accounts[obj.id] = obj;
    return obj.id;
  }

  /// 入金カテゴリ追加。
  /// @return {number} 追加したカテゴリのId。
  public incomeCategoryAdd(aName: string, aParent: Category | null) {
    // オブジェクト作成
    const obj = new Category();
    obj.name = aName;
    if (aParent != null) {
        obj.parent = this.income.categories[aParent.id];
        global.console.assert(obj.parent != null);
    }

    // 追加
    obj.id = this.nextId.income.category;
    this.nextId.income.category++;
    this.income.categories[obj.id] = obj;
    return obj.id;
  }

  /// 入金レコードの追加。
  /// @return {number} 追加したレコードのId。
  public incomeRecordAdd(
    aDate: YearMonthDayDate,
    aMemo: string,
    aAccount: Account,
    aCategory: Category,
    aAmount: number,
  ) {
    // オブジェクト作成
    const obj = new RecordIncome(aAccount, aCategory);
    obj.date = aDate;
    obj.memo = aMemo;
    obj.amount = aAmount;

    // 追加
    obj.id = this.nextId.income.record;
    this.nextId.income.record++;
    this.income.records[obj.id] = obj;
    return obj.id;
  }

}

export default Root;
