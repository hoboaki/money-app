# 開発記録

## 2018-08-05 TypeScript 内で ipcRenderer 使おうとしたら固まる

target が node になっていたのが原因でした。electron-renderer に変えることで対処。

- https://github.com/electron/electron/issues/8846

## 2018-08-05 setInterval のコールバック関数の this ではまる

setInterval の中で this.setState() しようとしたらうまくいかなかったのはこれが原因。

- http://js.studio-kingdom.com/javascript/window/set_interval

## 2018-08-05 React + TypeScript 構成に乗換開始

(この日より前の記録はこの日に書きました)

静的型付けのために TypeScript に変更する。
ついでにHTML出力も楽したいので React に変更してみる。

- スケルトン作成参考
https://qiita.com/EBIHARA_kenji/items/25e59f7132b96cb886f3
- css の import 対応参考
https://qiita.com/Quramy/items/a5d8967cdbd1b8575130
- App コンポーネントコード参考
https://github.com/azu/react-typescript-startup

watch コマンドも整備。

## 2018-08-04 js でデータモデル作成きつくなってきた

静的型付けが欲しい…！

## 2018-08-03 配列は for in じゃなくて for of

配列に対して for in すると index 値が返ってくるので注意。

## 2018-08-02 データモデル作成開始

js のコンストラクタがトリッキー。

```js
**
 * 口座。
 * @constructor
 */
let Account = function() {
    this.id = 0; ///< Id。
    this.name = ""; ///< 口座名。
    this.kind = AccountKind.Invalid; ///< 種類。
    this.initialAmount = 0.0; ///< 初期金額。プラスが貯蓄。マイナスが負債。
};
let account = new Account();
```

## 2018-08-01 スピリッター

Split.js を使った。

![ss](ss-2018-08-01a.png)

## 2018-07-28 アカウントシート

こんな感じよねーを確認するため HTML 直書きで確認。配色はまだぱっとしない。

![ss](ss-2018-07-28a.png)

## 2018-07-27 ツールバーは今風にサイドバー

MaterialDesign 配色も使いながらレイアウトを変更。
スプレッドシートビューのコントロールバーも作成。

![ss](ss-2018-07-27a.png)

## 2018-07-23 タイトルバーとツールバー

MaterialDesign アイコンを使用。
MainプロセスとRenderプロセスははまりどころ。

![ss](ss-2018-07-23a.png)

## 初期状態

C++,C# をメインに使っている人が趣味の時間を使って家計簿アプリを作っていきます。
HTML,CSS,Javascript は 2000 年初頭レベルの知識しかないです。
