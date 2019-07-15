import { combineReducers, createStore } from 'redux';
import DocReducer from './doc/Reducer';
import * as DocState from './doc/States';

// データ型。
export interface IState {
  doc: DocState.IState;
  // state が増えたら足していく
}

// 複数の reducer を束ねる
const combinedReducer = combineReducers<IState>({
  doc: DocReducer,
  // reducer が増えたら足していく
});

// グローバルオブジェクトとして、store を作成する。
const store = createStore(combinedReducer);
export default store;
