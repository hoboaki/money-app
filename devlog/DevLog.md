# 開発記録

## 2018-08-05 React + TypeScript 構成に乗換開始

参考。
https://qiita.com/EBIHARA_kenji/items/25e59f7132b96cb886f3

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
