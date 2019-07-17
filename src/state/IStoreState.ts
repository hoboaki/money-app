import * as DocState from './doc/States';
import * as UiState from './ui/States';

// データ型。
export default interface IStoreState {
  doc: DocState.IState;
  ui: UiState.IState;
  // state が増えたら足していく
}
