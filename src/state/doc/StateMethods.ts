import Clone from 'clone';

import DataAccount from 'src/data-model/doc/Account';
import DataCategory from 'src/data-model/doc/Category';
import DataRecordIncome from 'src/data-model/doc/RecordIncome';
import DataRecordOutgo from 'src/data-model/doc/RecordOutgo';
import DataRecordTransfer from 'src/data-model/doc/RecordTransfer';
import DataRoot from 'src/data-model/doc/Root';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
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
  const r = Clone(States.defaultState);

  // 口座
  const accountIdDict: {[key: number]: number} = {}; // Data内Id → オブジェクトId 変換テーブル
  for (const data of src.accounts) {
    const kind = enumPraseAccountKind(data.kind);
    const key = accountAdd(r, data.name, kind, data.initialAmount, IYearMonthDayDateUtils.fromText(data.startDate));
    accountIdDict[data.id] = key;
  }

  // 入金
  {
    const categoryIdDict: {[key: number]: number} = {}; // Data内Id -> オブジェクトId 変換テーブル
    for (const data of src.income.categories) {
      let parentId = null;
      if (data.parent !== 0) {
        parentId = categoryIdDict[data.parent];
        if (parentId == null) {
            throw new Error(`Error: Invalid parent value(${data.parent}) in income category (id: '${data.id}').`);
        }
      }
      const key = incomeCategoryAdd(r, data.name, parentId);
      categoryIdDict[data.id] = key;
    }
    for (const data of src.income.records) {
      const categoryId = categoryIdDict[data.category];
      if (categoryId == null) {
          throw new Error(`Error: Invalid category value(${data.category}) in income record.`);
      }
      const accountId = accountIdDict[data.account];
      if (accountId == null) {
          throw new Error(`Error: Invalid account value(${data.account}) in income record.`);
      }
      incomeRecordAdd(
        r,
        new Date(data.createDate),
        new Date(data.updateDate),
        IYearMonthDayDateUtils.fromText(data.date),
        data.memo,
        accountId,
        categoryId,
        data.amount,
      );
    }
  }

  // 出金
  {
    const categoryIdDict: {[key: number]: number} = {}; // Data内Id -> オブジェクトId 変換テーブル
    for (const data of src.outgo.categories) {
      let parentId = null;
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
        new Date(data.createDate),
        new Date(data.updateDate),
        IYearMonthDayDateUtils.fromText(data.date),
        data.memo,
        accountId,
        categoryId,
        data.amount,
      );
    }
  }

  // 送金
  {
    for (const data of src.transfer.records) {
      const accountFromId = accountIdDict[data.accountFrom];
      if (accountFromId == null) {
          throw new Error(`Error: Invalid account value(${data.accountFrom}) in transfer record.`);
      }
      const accountToId = accountIdDict[data.accountTo];
      if (accountToId == null) {
          throw new Error(`Error: Invalid account value(${data.accountTo}) in transfer record.`);
      }
      transferRecordAdd(
        r,
        new Date(data.createDate),
        new Date(data.updateDate),
        IYearMonthDayDateUtils.fromText(data.date),
        data.memo,
        accountFromId,
        accountToId,
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
  const accountIdDict: {[key: number]: number} = {}; // AccountId -> エクスポート先のId 辞書
  state.account.order.forEach((key) => {
    const src = state.account.accounts[key];
    const data = new DataAccount();
    data.id = result.accounts.length + 1;
    data.name = src.name;
    data.kind = Types.AccountKind[src.kind];
    data.initialAmount = src.initialAmount;
    result.accounts.push(data);
    accountIdDict[src.id] = data.id;
  });

  // 入金
  {
    // カテゴリ
    const categoryIdDict: {[key: number]: number} = {}; // CategoryId -> エクスポート先のId 辞書
    const collectChildCategoryId = (ids: number[]): number[] => {
      return ids.reduce(
        (resultIds: number[], id: number) => {
          resultIds.push(id);
          const childs = state.income.categories[id].childs;
          if (childs.length !== 0) {
            resultIds = resultIds.concat(collectChildCategoryId(childs));
          }
          return resultIds;
        },
        [],
      );
    };
    const categoryOrder = collectChildCategoryId(state.income.categoryRootOrder);
    categoryOrder.forEach((key) => {
      const src = state.income.categories[key];
      const data = new DataCategory();
      data.id = result.income.categories.length + 1;
      data.name = src.name;
      if (src.parent != null) {
        data.parent = categoryIdDict[src.parent];
        if (data.parent === 0 || data.parent === undefined) {
          throw new Error('Not found income category parent id.');
        }
      }
      result.income.categories.push(data);
      categoryIdDict[src.id] = data.id;
    });

    // レコード
    for (const key in state.income.records) {
      if (!state.income.records.hasOwnProperty(key)) {
        continue;
      }
      const src = state.income.records[key];
      const data = new DataRecordIncome();
      data.createDate = src.createDate.toISOString();
      data.updateDate = src.updateDate.toISOString();
      data.date = IYearMonthDayDateUtils.toDataFormatText(src.date);
      data.memo = src.memo;
      data.amount = src.amount;
      data.category = categoryIdDict[src.category];
      data.account = accountIdDict[src.account];
      result.income.records.push(data);
    }
  }

  // 出金
  {
    // カテゴリ
    const categoryIdDict: {[key: number]: number} = {}; // CategoryId -> エクスポート先のId 辞書
    const collectChildCategoryId = (ids: number[]): number[] => {
      return ids.reduce(
        (resultIds: number[], id: number) => {
          resultIds.push(id);
          const childs = state.outgo.categories[id].childs;
          if (childs.length !== 0) {
            resultIds = resultIds.concat(collectChildCategoryId(childs));
          }
          return resultIds;
        },
        [],
      );
    };
    const categoryOrder = collectChildCategoryId(state.outgo.categoryRootOrder);
    categoryOrder.forEach((key) => {
      const src = state.outgo.categories[key];
      const data = new DataCategory();
      data.id = result.outgo.categories.length + 1;
      data.name = src.name;
      if (src.parent != null) {
        data.parent = categoryIdDict[src.parent];
        if (data.parent === 0 || data.parent === undefined) {
          throw new Error('Not found outgo category parent id.');
        }
      }
      result.outgo.categories.push(data);
      categoryIdDict[src.id] = data.id;
    });

    // レコード
    for (const key in state.outgo.records) {
      if (!state.outgo.records.hasOwnProperty(key)) {
        continue;
      }
      const src = state.outgo.records[key];
      const data = new DataRecordOutgo();
      data.createDate = src.createDate.toISOString();
      data.updateDate = src.updateDate.toISOString();
      data.date = IYearMonthDayDateUtils.toDataFormatText(src.date);
      data.memo = src.memo;
      data.amount = src.amount;
      data.category = categoryIdDict[src.category];
      data.account = accountIdDict[src.account];
      result.outgo.records.push(data);
    }
  }

  // 送金
  {
    // レコード
    for (const key in state.transfer.records) {
      if (!state.transfer.records.hasOwnProperty(key)) {
        continue;
      }
      const src = state.transfer.records[key];
      const data = new DataRecordTransfer();
      data.createDate = src.createDate.toISOString();
      data.updateDate = src.updateDate.toISOString();
      data.date = IYearMonthDayDateUtils.toDataFormatText(src.date);
      data.memo = src.memo;
      data.amount = src.amount;
      data.accountFrom = accountIdDict[src.accountFrom];
      data.accountTo = accountIdDict[src.accountTo];
      result.transfer.records.push(data);
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
  startDate: IYearMonthDayDate,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    name,
    kind,
    initialAmount,
    startDate,
  };

  // 追加
  obj.id = state.nextId.account;
  state.nextId.account++;
  state.account.accounts[obj.id] = obj;
  state.account.order.push(obj.id);
  return obj.id;
};

/** 指定の名前の口座オブジェクトを取得。見つからなければエラー。 */
export const accountByName = (
  state: States.IState,
  name: string,
  ): States.IAccount => {
  const account = Object.values(state.account.accounts).find((ac) => ac.name === name);
  if (account === undefined) {
    global.console.log(state.account.accounts);
    throw new Error(`Not found account named '${name}'.`);
  }
  return account;
};

/// 入金カテゴリ追加。
/// @return {number} 追加したカテゴリの CategoryId。
export const incomeCategoryAdd = (
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
  const parent = parentId != null ? state.income.categories[parentId] : null;

  // 追加
  obj.id = state.nextId.category;
  state.nextId.category++;
  state.income.categories[obj.id] = obj;
  if (parentId != null) {
    if (parent != null) {
      parent.childs.push(obj.id);
    } else {
      throw new Error(`Category parent (id: ${parentId}) is not exist.`);
    }
  } else {
    state.income.categoryRootOrder.push(obj.id);
  }
  return obj.id;
};

/**
 * 入金レコードの追加。
 * @param amount 金額。(入金がプラス・出金がマイナス)
 */
export const incomeRecordAdd = (
  state: States.IState,
  createDate: Date,
  updateDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    createDate,
    updateDate,
    date,
    memo,
    account: accountId,
    category: categoryId,
    amount,
  };

  // 追加
  obj.id = state.nextId.record;
  state.nextId.record++;
  state.income.records[obj.id] = obj;
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
  obj.id = state.nextId.category;
  state.nextId.category++;
  state.outgo.categories[obj.id] = obj;
  if (parentId != null) {
    if (parent != null) {
      parent.childs.push(obj.id);
    } else {
      throw new Error(`Category parent (id: ${parentId}) is not exist.`);
    }
  } else {
    state.outgo.categoryRootOrder.push(obj.id);
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
  updateDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    createDate,
    updateDate,
    date,
    memo,
    account: accountId,
    category: categoryId,
    amount,
  };

  // 追加
  obj.id = state.nextId.record;
  state.nextId.record++;
  state.outgo.records[obj.id] = obj;
  return obj.id;
};

/**
 * 送金レコードの追加。
 * @param amount 金額。送金元口座からは減算され送金先口座に加算される。
 */
export const transferRecordAdd = (
  state: States.IState,
  createDate: Date,
  updateDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountFromId: number,
  accountToId: number,
  amount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    createDate,
    updateDate,
    date,
    memo,
    accountFrom: accountFromId,
    accountTo: accountToId,
    amount,
  };

  // 追加
  obj.id = state.nextId.record;
  state.nextId.record++;
  state.transfer.records[obj.id] = obj;
  return obj.id;
};

/**
 * パス形式文字列でカテゴリを検索し ICategory オブジェクトで返す。見つからない場合はエラー。
 * @param categories incomeCategories もしくは outgoCategories の参照。
 * @param path 階層をスラッシュで区切った文字列。（例：'家事費/食費'）
 */
export const categoryByPath = (categories: {[key: number]: States.ICategory}, path: string) => {
  // 引数チェック
  if (path === '') {
    throw new Error(`Argument named 'path' is empty.`);
  }

  // スラッシュでパスを分解して検索
  const names = path.split('/');
  let parentId: number = 0;
  names.forEach((name) => {
    const cats = parentId === 0 ?
      Object.keys(categories).filter((cat) => categories[Number(cat)].parent == null).map((cat) => Number(cat)) :
      categories[parentId].childs;
    const nextId = cats.find((catId) => categories[catId].name === name);
    if (nextId === undefined) {
      global.console.log(`Finding '${name}' from parentId '${parentId}'.`);
      global.console.log(names);
      global.console.log(categories);
      throw new Error(`Not found category path '${path}'.`);
    }
    parentId = nextId;
  });
  return categories[parentId];
};

/** 最初に見つかる末端カテゴリの ICategory を返す。見つからない場合はエラー。 */
export const firstLeafCategory = (categories: {[key: number]: States.ICategory}) => {
  const category = Object.values(categories).find((cat) => cat.childs.length === 0);
  if (category === undefined) {
    throw new Error(`Not found leaf category.`);
  }
  return category;
};

/** ルート要素も考慮したソート済カテゴリID配列を取得。 */
export const categoryIdArray = (categoryRootOrder: number[], categories: {[key: number]: States.ICategory}) => {
  const result = new Array<number>();
  const proc = (categoryId: number) => {
    const cat = categories[categoryId];
    result.push(cat.id);
    cat.childs.forEach((childId) => {
      proc(childId);
    });
  };
  categoryRootOrder.forEach((categoryId) => {
    proc(categoryId);
  });
  return result;
};

/** 指定のカテゴリ以下に所属する末端カテゴリID配列を取得。 */
export const leafCategoryIdArray = (targetCategoryId: number, categories: {[key: number]: States.ICategory}) => {
  const result = new Array<number>();
  const proc = (categoryId: number) => {
    const cat = categories[categoryId];
    if (cat.childs.length === 0) {
      result.push(categoryId);
    } else {
      cat.childs.forEach((childId) => {
        proc(childId);
      });
    }
  };
  proc(targetCategoryId);
  return result;
};
