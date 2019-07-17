import { combineReducers, createStore } from 'redux';
import DocReducer from './doc/Reducer';
import * as DocState from './doc/States';
import IStoreState from './IStoreState';
import UiReducer from './ui/Reducer';

// 複数の reducer を束ねる
const combinedReducer = combineReducers<IStoreState>({
  doc: DocReducer,
  ui: UiReducer,
  // reducer が増えたら足していく
});

// グローバルオブジェクトとして、store を作成する。
const store = createStore(combinedReducer);
export default store;
