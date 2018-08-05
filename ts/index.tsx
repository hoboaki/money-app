// インポート。
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

// 全 css ファイルを require して watch 対応。
function requireAll(r: any) {
  r.keys().forEach(r);
}
requireAll((require as any).context('./', true, /\.css$/));

// 描画
const container = document.getElementById('contents');
ReactDom.render(
  <App/>,
  container,
);

// EOF
