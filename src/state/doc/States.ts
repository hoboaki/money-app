import IYearMonthDayDate from 'src/util/IYearMonthDayDate';

import * as Types from './Types';

/** 全口座共通インターフェース。 */
export interface IAccount {
  /** AccountId。 */
  id: number;
  /** 口座名 */
  name: string;
}

/** 基本口座。 */
export interface IBasicAccount extends IAccount {
  /** 種類。 */
  kind: Types.BasicAccountKind;
  /** 初期金額。プラスが貯蓄。マイナスが負債。 */
  initialAmount: number;
  /** 口座開設日。initialAmount が加算される日。 */
  startDate: IYearMonthDayDate;
}

/** 集計口座。 */
export interface IAggregateAccount extends IAccount {
  /** 集計対象となる AccountId の配列。 */
  accounts: number[];
}

/** レコードのカテゴリ。 */
export interface ICategory {
  id: number; // CategoryId。
  name: string; // カテゴリ名。
  collapse: boolean; // ワークシート表示で閉じて表示するか。
  parent: number | null; // 親 Category の CategoryId 。null ならルート。
  childs: number[]; // 子 Category の CategoryId 配列。
}

/** 全レコード共通インターフェース。 */
export interface IRecord {
  id: number; // RecordId。
  createDate: Date; // レコード作成日。
  updateDate: Date; // レコード更新日。
  date: IYearMonthDayDate; // 入出金発生日付。
  memo: string; // メモ。
}

/** 出金レコード。 */
export interface IOutgoRecord extends IRecord {
  account: number; // 基本口座の AccountId。
  category: number; // 出金カテゴリの CategoryId。
  /** 金額。(出金がプラス・入金がマイナス) */
  amount: number;
}

/** 入金レコード。 */
export interface IIncomeRecord extends IRecord {
  account: number; // 基本口座の AccountId。
  category: number; // 入金カテゴリの CategoryId。
  /** 金額。(入金がプラス・出金がマイナス) */
  amount: number;
}

/** 資金移動レコード。 */
export interface ITransferRecord extends IRecord {
  accountFrom: number; // 送金元基本口座の AccountId。
  accountTo: number; // 送金先基本口座の AccountId。
  /** 金額。送金元口座からは減算され送金先口座に加算される。 */
  amount: number;
}

/** Palmカテゴリ情報。 */
export interface IPalmCategoryInfo {
  /** 対応する口座ID。INVALID_ID なら口座に変換されないことを示す。 */
  account: number;

  /** 対応するカテゴリID。INVALID_ID ならカテゴリに変換されないことを示す。 */
  category: number;
}

/** ドキュメントルート。 */
export interface IState {
  /** 基本口座。 */
  basicAccount: {
    /** 資産口座の並び順（AccountId の配列）定義。 */
    orderAssets: number[];

    /** 負債口座の並び順（AccountId の配列）定義。 */
    orderLiabilities: number[];

    /** AccountId がキーの口座群。 */
    accounts: { [key: number]: IBasicAccount };
  };

  /** 集計口座。 */
  aggregateAccount: {
    /** 集計口座の並び順（AggregateAccountId の配列）定義。 */
    order: number[];
    /** AggregateAccountId がキーの口座群。 */
    accounts: { [key: number]: IAggregateAccount };
  };

  /** 入金。 */
  income: {
    /** 入金カテゴリの CategoryId がキーの入金カテゴリ郡。 */
    categories: { [key: number]: ICategory };
    /** 入金レコードの RecordId がキーの入金レコード。 */
    records: { [key: number]: IIncomeRecord };
    /** ルートカテゴリの CategoryId。 */
    rootCategoryId: number;
  };

  /** 出金。 */
  outgo: {
    /** 出金カテゴリの CategoryId がキーの出金カテゴリ郡。 */
    categories: { [key: number]: ICategory };
    /** 出金レコードの RecordId がキーの出金レコード郡。 */
    records: { [key: number]: IOutgoRecord };
    /** ルートカテゴリの CategoryId。 */
    rootCategoryId: number;
  };

  /** 資金移動。 */
  transfer: {
    /** 資金移動レコードの RecordId がキーの資金移動レコード郡。 */
    records: { [key: number]: ITransferRecord };
  };

  /** インポートツール用データ。 */
  importTool: {
    /** Palmカテゴリ情報。 */
    palmCategories: {
      income: { [key: string]: IPalmCategoryInfo };
      outgo: { [key: string]: IPalmCategoryInfo };
    };
  };

  /** 次に使用するId。0(Types.INVALID_ID) は無効値。 */
  nextId: {
    account: number; // 集計口座もこの番号を使用。
    category: number;
    record: number;
  };
}

export const defaultState: IState = {
  basicAccount: {
    orderAssets: [],
    orderLiabilities: [],
    accounts: {},
  },
  income: {
    categories: {},
    records: {},
    rootCategoryId: Types.INVALID_ID,
  },
  outgo: {
    categories: {},
    records: {},
    rootCategoryId: Types.INVALID_ID,
  },
  transfer: {
    records: {},
  },
  aggregateAccount: {
    order: [],
    accounts: {},
  },
  importTool: {
    palmCategories: {
      income: {},
      outgo: {},
    },
  },
  nextId: {
    account: 1,
    category: 1,
    record: 1,
  },
};
