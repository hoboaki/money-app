import Redux from 'redux';
import { Action } from 'redux';
import createA2RMapper from 'src/util/ActionToReducerMapper';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';

import * as Actions from './Actions';
import * as States from './States';
import * as Types from './Types';

const a2RMapper = createA2RMapper<States.IState>();

a2RMapper.addWork<Actions.IDocumentSetFilePath>(Actions.DOCUMENT_SET_FILE_PATH, (state, action) => {
  state.document.filePath = action.filePath;
});

a2RMapper.addWork<Action>(Actions.DOCUMENT_REQUEST_AUTO_SAVE, (state, action) => {
  state.document.requestAutoSave = true;
});

a2RMapper.addWork<Action>(Actions.DOCUMENT_RECEIVED_REQUEST_AUTO_SAVE, (state, action) => {
  state.document.requestAutoSave = false;
});

a2RMapper.addWork<Action>(Actions.CALENDAR_MOVE_PREV, (state, action) => {
  state.pageCalendar.currentDate = IYearMonthDayDateUtils.prevMonth(state.pageCalendar.currentDate);
});

a2RMapper.addWork<Action>(Actions.CALENDAR_MOVE_NEXT, (state, action) => {
  state.pageCalendar.currentDate = IYearMonthDayDateUtils.nextMonth(state.pageCalendar.currentDate);
});

a2RMapper.addWork<Action>(Actions.CALENDAR_MOVE_TODAY, (state, action) => {
  state.pageCalendar.currentDate = IYearMonthDayDateUtils.firstDayOfMonth(IYearMonthDayDateUtils.today());
});

a2RMapper.addWork<Action>(Actions.SHEET_MOVE_PREV, (state, action) => {
  state.pageSheet.currentDate = IYearMonthDayDateUtils.prevDate(
    state.pageSheet.currentDate,
    Types.sheetViewUnitToDateUnit(state.pageSheet.viewUnit),
  );
});

a2RMapper.addWork<Action>(Actions.SHEET_MOVE_NEXT, (state, action) => {
  state.pageSheet.currentDate = IYearMonthDayDateUtils.nextDate(
    state.pageSheet.currentDate,
    Types.sheetViewUnitToDateUnit(state.pageSheet.viewUnit),
  );
});

a2RMapper.addWork<Action>(Actions.SHEET_MOVE_TODAY, (state, action) => {
  state.pageSheet.currentDate = IYearMonthDayDateUtils.today();
});

a2RMapper.addWork<Actions.ISheetMoveSpecified>(Actions.SHEET_MOVE_SPECIFIED, (state, action) => {
  state.pageSheet.currentDate = action.date;
});

a2RMapper.addWork<Actions.ISheetChangeViewUnit>(Actions.SHEET_CHANGE_VIEW_UNIT, (state, action) => {
  state.pageSheet.viewUnit = action.viewUnit;
});

a2RMapper.addWork<Actions.IRecordEditDialogUpdateLatestValue>(
  Actions.RECORD_EDIT_DIALOG_UPDATE_LATEST_VALUE,
  (state, action) => {
    const target = state.dialogAddRecord;
    if (action.latestFormAccount !== null) {
      target.latestFormAccount = action.latestFormAccount;
    }
    if (action.latestFormCategoryIncome !== null) {
      target.latestFormCategoryIncome = action.latestFormCategoryIncome;
    }
    if (action.latestFormCategoryOutgo !== null) {
      target.latestFormCategoryOutgo = action.latestFormCategoryOutgo;
    }
  },
);

// Reducer 本体。
const Reducer: Redux.Reducer<States.IState> = (state = States.defaultState, action) => {
  return a2RMapper.execute(state, action);
};
export default Reducer;
