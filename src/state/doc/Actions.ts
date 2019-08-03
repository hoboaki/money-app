import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as States from './States';

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
