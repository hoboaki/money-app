import { Action } from 'redux';
import { v4 as UUID } from 'uuid';
import * as Types from './Types';

/** 続けて入力するモードを変更。 */
export const DIALOG_ADD_RECORD_SET_CONTINUE_MODE = UUID();
export interface IDialogAddRecordSetContinueMode extends Action {
  isContinueMode: boolean;
}
export const dialogAddRecordSetContinueMode = (isContinueMode: boolean): IDialogAddRecordSetContinueMode => {
  return {
    type: DIALOG_ADD_RECORD_SET_CONTINUE_MODE,
    isContinueMode,
  };
};

/// カレンダー１つ前へ。
export const CALENDAR_MOVE_PREV = UUID();
export const calendarMovePrev = (): Action => {
  return {
    type: CALENDAR_MOVE_PREV,
  };
};

/// カレンダー１つ次へ。
export const CALENDAR_MOVE_NEXT = UUID();
export const calendarMoveNext = (): Action => {
  return {
    type: CALENDAR_MOVE_NEXT,
  };
};

/// カレンダー今日へ。
export const CALENDAR_MOVE_TODAY = UUID();
export const calendarMoveToday = (): Action => {
  return {
    type: CALENDAR_MOVE_TODAY,
  };
};

/// シート１つ前へ。
export const SHEET_MOVE_PREV = UUID();
export const sheetMovePrev = (): Action => {
  return {
    type: SHEET_MOVE_PREV,
  };
};

/// シート１つ次へ。
export const SHEET_MOVE_NEXT = UUID();
export const sheetMoveNext = (): Action => {
  return {
    type: SHEET_MOVE_NEXT,
  };
};

/// シート今日へ。
export const SHEET_MOVE_TODAY = UUID();
export const sheetMoveToday = (): Action => {
  return {
    type: SHEET_MOVE_TODAY,
  };
};

/// シート表示単位変更。
export const SHEET_CHANGE_VIEW_UNIT = UUID();
export interface ISheetChangeViewUnit extends Action {
  viewUnit: Types.SheetViewUnit;
}
export const sheetChangeViewUnit = (viewUnit: Types.SheetViewUnit): ISheetChangeViewUnit => {
  return {
    type: SHEET_CHANGE_VIEW_UNIT,
    viewUnit,
  };
};
