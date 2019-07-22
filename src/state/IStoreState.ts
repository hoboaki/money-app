import * as DocStates from './doc/States';
import * as UiStates from './ui/States';

// データ型。
export default interface IStoreState {
  doc: DocStates.IState;
  ui: UiStates.IState;
  // state が増えたら足していく
}
