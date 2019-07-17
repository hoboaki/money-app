import { Action } from 'redux';
import { v4 as UUID } from 'uuid';

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
