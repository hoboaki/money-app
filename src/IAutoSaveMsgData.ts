import * as DocStates from 'src/state/doc/States';
import * as UiStates from 'src/state/ui/States';

export default interface IAutoSaveMsgData {
  doc: DocStates.IState;
  ui: UiStates.IState;
}
