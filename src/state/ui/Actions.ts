import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

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
