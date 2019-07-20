import Clone from 'clone';
import DataAccount from '../../data-model/doc/Account';
import DataCategory from '../../data-model/doc/Category';
import DataRecordIncome from '../../data-model/doc/RecordIncome';
import DataRecordOutgo from '../../data-model/doc/RecordOutgo';
import DataRecordTransfer from '../../data-model/doc/RecordTransfer';
import DataRoot from '../../data-model/doc/Root';
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
  const r = Clone(States.defaultState);

  // 口座
  const accountIdDict: {[key: number]: number} = {}; // Data内Id → オブジェクトId 変換テーブル
  for (const data of src.accounts) {
    const kind = enumPraseAccountKind(data.kind);
    const key = accountAdd(r, data.name, kind, data.initialAmount);
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
        YearMonthDayDate.fromText(data.date),
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
        YearMonthDayDate.fromText(data.date),
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
        YearMonthDayDate.fromText(data.date),
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

  // 入金
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
    for (const key in state.income.records) {
      if (!state.income.records.hasOwnProperty(key)) {
        continue;
      }
      const src = state.income.records[key];
      const data = new DataRecordIncome();
      data.createDate = src.createDate.toISOString();
      data.updateDate = src.updateDate.toISOString();
      data.date = src.date.toText();
      data.memo = src.memo;
      data.amount = src.amount;
      data.category = src.category;
      data.account = src.account;
      result.income.records.push(data);
    }
  }

  // 出金
  {
    // カテゴリ
    for (const key in state.outgo.categories) {
      if (!state.outgo.categories.hasOwnProperty(key)) {
        continue;
      }
      const src = state.outgo.categories[key];
      const data = new DataCategory();
      data.id = src.id;
      data.name = src.name;
      if (src.parent != null) {
        data.parent = src.parent;
      }
      result.outgo.categories.push(data);
    }

    // レコード
    for (const key in state.outgo.records) {
      if (!state.outgo.records.hasOwnProperty(key)) {
        continue;
      }
      const src = state.outgo.records[key];
      const data = new DataRecordOutgo();
      data.createDate = src.createDate.toISOString();
      data.updateDate = src.updateDate.toISOString();
      data.date = src.date.toText();
      data.memo = src.memo;
      data.amount = src.amount;
      data.category = src.category;
      data.account = src.account;
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
      data.date = src.date.toText();
      data.memo = src.memo;
      data.amount = src.amount;
      data.accountFrom = src.accountFrom;
      data.accountTo = src.accountTo;
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

/** 指定の名前の口座オブジェクトを取得。見つからなければエラー。 */
export const accountByName = (
  state: States.IState,
  name: string,
  ): States.IAccount => {
  const account = Object.values(state.accounts).find((ac) => ac.name === name);
  if (account === undefined) {
    global.console.log(state.accounts);
    throw new Error(`Not found account named '${name}'.`);
  }
  return account;
};

/**
 * コードの中で日付の範囲を指定して絞り込む。
 * @param records 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const recordsFromRecordsByDateRange = <TRecord extends States.IRecord>(
  records: TRecord[],
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): TRecord[] => {
  return records.filter((rec) => {
    return dateBegin.date <= rec.date.date && rec.date.date < dateEnd.date;
    });
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
  obj.id = state.nextId.income.category;
  state.nextId.income.category++;
  state.income.categories[obj.id] = obj;
  if (parentId != null) {
    if (parent != null) {
      parent.childs.push(obj.id);
    } else {
      throw new Error(`Category parent (id: ${parentId}) is not exist.`);
    }
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
  date: YearMonthDayDate,
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
  obj.id = state.nextId.income.record;
  state.nextId.income.record++;
  state.income.records[obj.id] = obj;
  return obj.id;
};

/**
 * 入金レコードの中で日付の範囲を指定して絞り込む。
 * @returns IRecordIncome[]
 * @param state 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const incomeRecordsFromStateyDateRange = (
  state: States.IState,
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): States.IRecordIncome[] => {
  return incomeRecordsFromRecordsByDateRange(
    Object.values(state.income.records),
    dateBegin,
    dateEnd,
  );
};

/**
 * 入金レコードの中で日付の範囲を指定して絞り込む。
 * @returns IRecordIncome[]
 * @param records 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const incomeRecordsFromRecordsByDateRange = (
  records: States.IRecordIncome[],
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): States.IRecordIncome[] => {
  return recordsFromRecordsByDateRange(records, dateBegin, dateEnd);
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
      throw new Error(`Category parent (id: ${parentId}) is not exist.`);
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
  updateDate: Date,
  date: YearMonthDayDate,
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
  obj.id = state.nextId.outgo.record;
  state.nextId.outgo.record++;
  state.outgo.records[obj.id] = obj;
  return obj.id;
};

/**
 * 出金レコードの中で日付の範囲を指定して絞り込む。
 * @returns IRecordOutgo[]
 * @param state 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const outgoRecordsFromStateyDateRange = (
  state: States.IState,
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): States.IRecordOutgo[] => {
  return outgoRecordsFromRecordsByDateRange(
    Object.values(state.outgo.records),
    dateBegin,
    dateEnd,
  );
};

/**
 * 出金レコードの中で日付の範囲を指定して絞り込む。
 * @returns IRecordOutgo[]
 * @param records 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const outgoRecordsFromRecordsByDateRange = (
  records: States.IRecordOutgo[],
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): States.IRecordOutgo[] => {
  return recordsFromRecordsByDateRange(records, dateBegin, dateEnd);
};

/**
 * 送金レコードの追加。
 * @param amount 金額。送金元口座からは減算され送金先口座に加算される。
 */
export const transferRecordAdd = (
  state: States.IState,
  createDate: Date,
  updateDate: Date,
  date: YearMonthDayDate,
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
  obj.id = state.nextId.transfer.record;
  state.nextId.transfer.record++;
  state.transfer.records[obj.id] = obj;
  return obj.id;
};

/**
 * 送金レコードの中で日付の範囲を指定して絞り込む。
 * @returns IRecordOutgo[]
 * @param state 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const transferRecordsFromStateyDateRange = (
  state: States.IState,
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): States.IRecordTransfer[] => {
  return transferRecordsFromRecordsByDateRange(
    Object.values(state.transfer.records),
    dateBegin,
    dateEnd,
  );
};

/**
 * 送金レコードの中で日付の範囲を指定して絞り込む。
 * @returns IRecordTransfer[]
 * @param records 検索対象。
 * @param dateBegin 開始日。この日を含む。
 * @param dateEnd 終了日。この日は含まない。
 */
export const transferRecordsFromRecordsByDateRange = (
  records: States.IRecordTransfer[],
  dateBegin: YearMonthDayDate,
  dateEnd: YearMonthDayDate,
  ): States.IRecordTransfer[] => {
  return recordsFromRecordsByDateRange(records, dateBegin, dateEnd);
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
