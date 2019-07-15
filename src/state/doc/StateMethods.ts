import DataAccount from '../../Model/Doc/Data/Account';
import DataCategory from '../../Model/Doc/Data/Category';
import DataRecordOutgo from '../../Model/Doc/Data/RecordOutgo';
import DataRoot from '../../Model/Doc/Data/Root';
import YearMonthDayDate from '../../util/YearMonthDayDate';
import * as States from './States';
import * as Types from './Types';

/** DataRoot から State を作成。 */
export const fromData = (src: DataRoot) => {
  // enum デシリアライズ
  const enumPraseAccountKind = (targetKey: string): Types.AccountKind => {
    for (const key in Types.AccountKind) {
      if (key === targetKey) {
        return (+Types.AccountKind[key]) as Types.AccountKind;
      }
    }
    throw new Error(`Error: Not found key named '${targetKey}'.`);
  };

  // 結果
  const r = States.defaultState;

  //  口座
  const accountIdDict: {[key: number]: number} = {}; // Data内Id → オブジェクトId 変換テーブル
  for (const data of src.accounts) {
    const kind = enumPraseAccountKind(data.kind);
    const key = accountAdd(r, data.name, kind, data.initialAmount);
    accountIdDict[data.id] = key;
  }

  // 出金
  {
      const categoryIdDict: {[key: number]: number} = {}; // Data内Id -> オブジェクトId 変換テーブル
      for (const data of src.outgo.categories) {
        let parentId = 0;
        if (data.parent !== 0) {
            parentId = categoryIdDict[data.parent];
            if (parentId == null) {
                throw new Error(`Error: Invalid parent value(${data.parent}) in outgo category (id: '${data.id}').`);
            }
        }
        const key = outgoCategoryAdd(r, data.name, parentId);
        categoryIdDict[data.id] = key;
      }
      for (const data of src.outgo.records) {
        const categoryId = categoryIdDict[data.category];
        if (categoryId == null) {
            throw new Error(`Error: Invalid category value(${data.category}) in outgo record.`);
        }
        const accountId = accountIdDict[data.account];
        if (accountId == null) {
            throw new Error(`Error: Invalid account value(${data.account}) in outgo record.`);
        }
        outgoRecordAdd(
          r,
          new Date(), // @todo データからひっぱってくる。
          YearMonthDayDate.fromText(data.date),
          data.memo,
          accountId,
          categoryId,
          data.amount,
        );
      }
  }

  return r;
};

/** ドキュメントルートデータにエクスポート。 */
export const toData = (state: States.IState) => {
  // 結果オブジェクト
  const result = new DataRoot();

  // 口座
  for (const key in state.accounts) {
    if (!state.accounts.hasOwnProperty(key)) {
      continue;
    }
    const src = state.accounts[key];
    const data = new DataAccount();
    data.id = src.id;
    data.name = src.name;
    data.kind = Types.AccountKind[src.kind];
    result.accounts.push(data);
    data.initialAmount = src.initialAmount;
  }

  // 出金
  {
    // カテゴリ
    for (const key in state.income.categories) {
      if (!state.income.categories.hasOwnProperty(key)) {
        continue;
      }
      const src = state.income.categories[key];
      const data = new DataCategory();
      data.id = src.id;
      data.name = src.name;
      if (src.parent != null) {
        data.parent = src.parent;
      }
      result.income.categories.push(data);
    }

    // レコード
    for (const key in state.outgo.records) {
      if (!state.outgo.records.hasOwnProperty(key)) {
        continue;
      }
      const src = state.outgo.records[key];
      const data = new DataRecordOutgo();
      data.date = src.date.toText();
      data.memo = src.memo;
      data.amount = src.amount;
      data.category = src.category;
      data.account = src.account;
      result.outgo.records.push(data);
    }
  }

  // 結果を返す
  return result;
};

/**
 * 口座追加。
 * @return {number} 追加した口座のId。
 */
export const accountAdd = (
  state: States.IState,
  name: string,
  kind: Types.AccountKind,
  initialAmount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    name,
    kind,
    initialAmount,
  };

  // 追加
  obj.id = state.nextId.account;
  state.nextId.account++;
  state.accounts[obj.id] = obj;
  return obj.id;
};

/// 出金カテゴリ追加。
/// @return {number} 追加したカテゴリの CategoryId。
export const outgoCategoryAdd = (
  state: States.IState,
  name: string,
  parentId: number | null,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    name,
    parent: parentId,
    childs: [],
  };
  const parent = parentId != null ? state.outgo.categories[parentId] : null;

  // 追加
  obj.id = state.nextId.outgo.category;
  state.nextId.outgo.category++;
  state.outgo.categories[obj.id] = obj;
  if (parentId != null) {
    if (parent != null) {
      parent.childs.push(obj.id);
    } else {
      global.console.assert(false);
    }
  }
  return obj.id;
};

/**
 * 出金レコードの追加。
 * @param amount 金額。(出金がプラス・入金がマイナス)
 */
export const outgoRecordAdd = (
  state: States.IState,
  createDate: Date,
  date: YearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ) => {
  global.console.log('Called outgoRecordAdd');

  // オブジェクト作成
  const obj = {
    id: 0,
    createDate,
    updateDate: createDate,
    date,
    memo,
    account: accountId,
    category: categoryId,
    amount,
  };

  // 追加
  obj.id = state.nextId.outgo.record;
  state.nextId.outgo.record++;
  state.outgo.records[obj.id] = obj;
  return obj.id;
};
