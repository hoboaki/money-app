/**
 * @fileoverview index.js に変換されるエントリーポイント。
 */
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import Store from './state/Store';
import MainWindow from './view/root/main-window';

// node_modules の css ロード
import 'flatpickr/dist/themes/dark.css';

// 全 css ファイルを require して watch 対応。
function requireAll(r: any) {
  r.keys().forEach(r);
}
requireAll((require as any).context('./', true, /\.css$/));

// AutoSaveWorker
import AutoSaveWorker from 'worker-loader!./AutoSaveWorker';
const worker = new AutoSaveWorker();
worker.postMessage({ a: 1 });
worker.onmessage = (event) => {
  // ...
};
worker.addEventListener('message', (event) => {
  // ...
});

// 描画
const container = document.getElementById('contents');
ReactDom.render(
  <Provider store={Store}>
    <MainWindow/>
  </Provider>,
  container,
);

// EOF
