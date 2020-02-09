import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

import * as Types from './Types';

/// ファイルパス設定。
export const DOCUMENT_SET_FILE_PATH = UUID();
export interface IDocumentSetFilePath extends Action {
  filePath: string;
}
export const documentSetFilePath = (filePath: string): IDocumentSetFilePath => {
  return {
    type: DOCUMENT_SET_FILE_PATH,
    filePath,
  };
};

/// 自動保存リクエスト。
export const DOCUMENT_REQUEST_AUTO_SAVE = UUID();
export const documentRequestAutoSave = (): Action => {
  return {
    type: DOCUMENT_REQUEST_AUTO_SAVE,
  };
};

/// 自動保存リクエスト受理。
export const DOCUMENT_RECEIVED_REQUEST_AUTO_SAVE = UUID();
export const documentReceivedRequestAutoSave = (): Action => {
  return {
    type: DOCUMENT_RECEIVED_REQUEST_AUTO_SAVE,
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
