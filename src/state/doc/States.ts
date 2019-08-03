import IYearMonthDayDate from '../../util/IYearMonthDayDate';
import * as Types from './Types';

/** 口座。 */
export interface IAccount {
  /** AccountId。 */
  id: number;
  /** 口座名 */
  name: string;
  /** 種類。 */
  kind: Types.AccountKind;
  /** 初期金額。プラスが貯蓄。マイナスが負債。 */
  initialAmount: number;
  /** 口座開設日。initialAmount が加算される日。 */
  startDate: IYearMonthDayDate;
}

/** レコードのカテゴリ。 */
export interface ICategory {
  id: number; // CategoryId。
  name: string; // カテゴリ名。
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
export interface IRecordOutgo extends IRecord {
  account: number; // AccountId。
  category: number; // CategoryId。
  /** 金額。(出金がプラス・入金がマイナス) */
  amount: number;
}

/** 入金レコード。 */
export interface IRecordIncome extends IRecord {
  account: number; // AccountId。
  category: number; // CategoryId。
  /** 金額。(入金がプラス・出金がマイナス) */
  amount: number;
}

/** 資金移動レコード。 */
export interface IRecordTransfer extends IRecord {
  accountFrom: number; // 送金元口座の AccountId。
  accountTo: number; // 送金先口座の AccountId。
  /** 金額。送金元口座からは減算され送金先口座に加算される。 */
  amount: number;
}

/** ドキュメントルート。 */
export interface IState {
  /** 口座。 */
  account: {
    /** 口座の並び順（AccountId の配列）定義。 */
    order: number[];
    /** AccountId がキーの口座群。 */
    accounts: {[key: number]: IAccount};
  };

  /** 入金。 */
  income: {
    /** 入金カテゴリのルート直下の並び順（CategoryId）定義。 */
    categoryRootOrder: number[];
    /** 入金カテゴリの CategoryId がキーの入金カテゴリ郡。 */
    categories: {[key: number]: ICategory};
    /** 入金レコードの RecordId がキーの入金レコード。 */
    records: {[key: number]: IRecordIncome};
  };

  /** 出金。 */
  outgo: {
    /** 出金カテゴリのルート直下の並び順（CategoryId）定義。 */
    categoryRootOrder: number[];
    /** 出金カテゴリの CategoryId がキーの出金カテゴリ郡。 */
    categories: {[key: number]: ICategory};
    /** 出金レコードの RecordId がキーの出金レコード郡。 */
    records: {[key: number]: IRecordOutgo};
  };

  /** 資金移動。 */
  transfer: {
    /** 資金移動レコードの RecordId がキーの資金移動レコード郡。 */
    records: {[key: number]: IRecordTransfer};
  };

  /** 次に使用するId。0(Types.INVALID_ID) は無効値。 */
  nextId: {
    account: number;
    category: number;
    record: number;
  };
}

const AccountGroupAssets = Types.AccountGroup.Assets;
export const defaultState: IState = {
  account: {
    order: [],
    accounts: {},
  },
  income: {
    categoryRootOrder: [],
    categories: {},
    records: {},
  },
  outgo: {
    categoryRootOrder: [],
    categories: {},
    records: {},
  },
  transfer: {
    records: {},
  },
  nextId: {
    account: 1,
    category: 1,
    record: 1,
  },
};
