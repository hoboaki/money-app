import { Action } from 'redux';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import { v4 as UUID } from 'uuid';

import * as States from './States';
import * as Types from './Types';

/// ドキュメントをリセット。
export const RESET_DOCUMENT = UUID();
export interface IResetDocument extends Action {
  doc: States.IState;
}
export const resetDocument = (state: States.IState): IResetDocument => {
  return {
    type: RESET_DOCUMENT,
    doc: state,
  };
};

/// 基本口座の追加。
export const ADD_BASIC_ACCOUNT = UUID();
export interface IAddBasicAccount extends Action {
  // 各変数の仕様は StateMethods.basicAccountAdd を参照。
  name: string;
  kind: Types.BasicAccountKind;
  initialAmount: number;
  startDate: IYearMonthDayDate;
}
export const addBasicAccount = (
  name: string,
  kind: Types.BasicAccountKind,
  initialAmount: number,
  startDate: IYearMonthDayDate,
): IAddBasicAccount => {
  return {
    type: ADD_BASIC_ACCOUNT,
    name,
    kind,
    initialAmount,
    startDate,
  };
};

/// 基本口座の更新。
export const UPDATE_BASIC_ACCOUNT = UUID();
export interface IUpdateBasicAccount extends Action {
  // 各変数の仕様は StateMethods.basicAccountUpdate を参照。
  accountId: number;
  name: string;
  kind: Types.BasicAccountKind;
  initialAmount: number;
  startDate: IYearMonthDayDate;
}
export const updateBasicAccount = (
  accountId: number,
  name: string,
  kind: Types.BasicAccountKind,
  initialAmount: number,
  startDate: IYearMonthDayDate,
): IUpdateBasicAccount => {
  return {
    type: UPDATE_BASIC_ACCOUNT,
    accountId,
    name,
    kind,
    initialAmount,
    startDate,
  };
};

/// 集計口座の追加。
export const ADD_AGGREGATE_ACCOUNT = UUID();
export interface IAddAggregateAccount extends Action {
  // 各変数の仕様は StateMethods.aggregateAccountAdd を参照。
  name: string;
  accounts: number[];
}
export const addAggregateAccount = (name: string, accounts: number[]): IAddAggregateAccount => {
  return {
    type: ADD_AGGREGATE_ACCOUNT,
    name,
    accounts,
  };
};

/// 基本口座の更新。
export const UPDATE_AGGREGATE_ACCOUNT = UUID();
export interface IUpdateAggregateAccount extends Action {
  // 各変数の仕様は StateMethods.aggregateAccountUpdate を参照。
  accountId: number;
  name: string;
  accounts: number[];
}
export const updateAggregateAccount = (
  accountId: number,
  name: string,
  accounts: number[],
): IUpdateAggregateAccount => {
  return {
    type: UPDATE_AGGREGATE_ACCOUNT,
    accountId,
    name,
    accounts,
  };
};

/// 口座の並び順更新。
export const UPDATE_ACCOUNT_ORDER = UUID();
export interface IUpdateAccountOrder extends Action {
  // 各変数の仕様は StateMethods.accountOrderUpdate を参照。
  accountKind: Types.AccountKind;
  oldIndex: number;
  newIndex: number;
}
export const updateAccountOrder = (
  accountKind: Types.AccountKind,
  oldIndex: number,
  newIndex: number,
): IUpdateAccountOrder => {
  return {
    type: UPDATE_ACCOUNT_ORDER,
    accountKind,
    oldIndex,
    newIndex,
  };
};

/// 口座の削除。
export const DELETE_ACCOUNT = UUID();
export interface IDeleteAccount extends Action {
  accountId: number;
}
export const deleteAccount = (accountId: number): IDeleteAccount => {
  return {
    type: DELETE_ACCOUNT,
    accountId,
  };
};

/// カテゴリの追加。
export const ADD_CATEGORY = UUID();
export interface IAddCategory extends Action {
  // 各変数の仕様は StateMethods.categoryAdd を参照。
  kind: Types.CategoryKind;
  name: string;
  parentId: number;
}
export const addCategory = (kind: Types.CategoryKind, name: string, parentId: number): IAddCategory => {
  return {
    type: ADD_CATEGORY,
    kind,
    name,
    parentId,
  };
};

/// カテゴリの更新。
export const UPDATE_CATEGORY = UUID();
export interface IUpdateCategory extends Action {
  // 各変数の仕様は StateMethods.categoryUpdate を参照。
  categoryId: number;
  name: string;
}
export const updateCategory = (categoryId: number, name: string): IUpdateCategory => {
  return {
    type: UPDATE_CATEGORY,
    categoryId,
    name,
  };
};

/// カテゴリの移動。
export const MOVE_CATEGORY = UUID();
export interface IMoveCategory extends Action {
  // 各変数の仕様は StateMethods.moveCategory を参照。
  categoryKind: Types.CategoryKind;
  categoryId: number;
  newParentId: number;
  newChildIndex: number;
}
export const moveCategory = (
  categoryKind: Types.CategoryKind,
  categoryId: number,
  newParentId: number,
  newChildIndex: number,
): IMoveCategory => {
  return {
    type: MOVE_CATEGORY,
    categoryKind,
    categoryId,
    newParentId,
    newChildIndex,
  };
};

/// カテゴリの削除。
export const DELETE_CATEGORY = UUID();
export interface IDeleteCategory extends Action {
  // 各変数の仕様は StateMethods.deleteCategory を参照。
  categoryId: number;
}
export const deleteCategory = (categoryId: number): IDeleteCategory => {
  return {
    type: DELETE_CATEGORY,
    categoryId,
  };
};

/// 入金レコードの追加。
export const ADD_RECORD_INCOME = UUID();
export interface IAddRecordIncome extends Action {
  createDate: Date;
  date: IYearMonthDayDate;
  memo: string;
  accountId: number;
  categoryId: number;
  amount: number;
}
export const addRecordIncome = (
  createDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
): IAddRecordIncome => {
  return {
    type: ADD_RECORD_INCOME,
    createDate,
    date,
    accountId,
    categoryId,
    amount,
    memo,
  };
};

/// 入金レコードの更新。
export const UPDATE_RECORD_INCOME = UUID();
export interface IUpdateRecordIncome extends Action {
  recordId: number;
  updateDate: Date;
  date: IYearMonthDayDate;
  memo: string;
  accountId: number;
  categoryId: number;
  amount: number;
}
export const updateRecordIncome = (
  recordId: number,
  updateDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
): IUpdateRecordIncome => {
  return {
    type: UPDATE_RECORD_INCOME,
    recordId,
    updateDate,
    date,
    accountId,
    categoryId,
    amount,
    memo,
  };
};

/// 出金レコードの追加。
export const ADD_RECORD_OUTGO = UUID();
export interface IAddRecordOutgo extends Action {
  createDate: Date;
  date: IYearMonthDayDate;
  memo: string;
  accountId: number;
  categoryId: number;
  amount: number;
}
export const addRecordOutgo = (
  createDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
): IAddRecordOutgo => {
  return {
    type: ADD_RECORD_OUTGO,
    createDate,
    date,
    accountId,
    categoryId,
    amount,
    memo,
  };
};

/// 出金レコードの更新。
export const UPDATE_RECORD_OUTGO = UUID();
export interface IUpdateRecordOutgo extends Action {
  recordId: number;
  updateDate: Date;
  date: IYearMonthDayDate;
  memo: string;
  accountId: number;
  categoryId: number;
  amount: number;
}
export const updateRecordOutgo = (
  recordId: number,
  updateDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
): IUpdateRecordOutgo => {
  return {
    type: UPDATE_RECORD_OUTGO,
    recordId,
    updateDate,
    date,
    accountId,
    categoryId,
    amount,
    memo,
  };
};

/// 資金移動レコードの追加。
export const ADD_RECORD_TRANSFER = UUID();
export interface IAddRecordTransfer extends Action {
  createDate: Date;
  date: IYearMonthDayDate;
  memo: string;
  accountFromId: number;
  accountToId: number;
  amount: number;
}
export const addRecordTransfer = (
  createDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountFromId: number,
  accountToId: number,
  amount: number,
): IAddRecordTransfer => {
  return {
    type: ADD_RECORD_TRANSFER,
    createDate,
    date,
    accountFromId,
    accountToId,
    amount,
    memo,
  };
};

/// 資金移動レコードの更新。
export const UPDATE_RECORD_TRANSFER = UUID();
export interface IUpdateRecordTransfer extends Action {
  recordId: number;
  updateDate: Date;
  date: IYearMonthDayDate;
  memo: string;
  accountFromId: number;
  accountToId: number;
  amount: number;
}
export const updateRecordTransfer = (
  recordId: number,
  updateDate: Date,
  date: IYearMonthDayDate,
  memo: string,
  accountFromId: number,
  accountToId: number,
  amount: number,
): IUpdateRecordTransfer => {
  return {
    type: UPDATE_RECORD_TRANSFER,
    recordId,
    updateDate,
    date,
    accountFromId,
    accountToId,
    amount,
    memo,
  };
};

/// レコードの削除。
export const DELETE_RECORDS = UUID();
export interface IDeleteRecords extends Action {
  records: number[];
}
export const deleteRecords = (
  /** 削除するレコードIDの配列。 */
  records: number[],
): IDeleteRecords => {
  return {
    type: DELETE_RECORDS,
    records,
  };
};

/// 開閉状態の更新。
export const UPDATE_CATEGORY_COLLAPSE = UUID();
export interface IUpdateCategoryCollapse extends Action {
  categoryId: number;
  isCollapsed: boolean;
}
export const updateCategoryCollapse = (categoryId: number, isCollapsed: boolean): IUpdateCategoryCollapse => {
  return {
    type: UPDATE_CATEGORY_COLLAPSE,
    categoryId,
    isCollapsed,
  };
};

/** 入金Palmカテゴリ情報を追加。 */
export const ADD_PALM_CATEGORY_INFO_INCOME = UUID();
export interface IAddPalmCategoryInfoIncome extends Action {
  name: string;
  accountId: number;
  categoryId: number;
}
export const addPalmCategoryInfoIncome = (
  name: string,
  accountId: number,
  categoryId: number,
): IAddPalmCategoryInfoIncome => {
  return {
    type: ADD_PALM_CATEGORY_INFO_INCOME,
    name,
    accountId,
    categoryId,
  };
};

/** 入金Palmカテゴリ情報を追加。 */
export const ADD_PALM_CATEGORY_INFO_OUTGO = UUID();
export interface IAddPalmCategoryInfoOutgo extends Action {
  name: string;
  accountId: number;
  categoryId: number;
}
export const addPalmCategoryInfoOutgo = (
  name: string,
  accountId: number,
  categoryId: number,
): IAddPalmCategoryInfoOutgo => {
  return {
    type: ADD_PALM_CATEGORY_INFO_OUTGO,
    name,
    accountId,
    categoryId,
  };
};
