# 開発記録

## 2019-07-05 DatePicker 探訪

bootstrap-material-datetimepicker を使おうとしたが TypeScript バインドを手動で書かないといけなくて断念。
別のを探そう。

## 2019-06-25 map 入れ子のキレイな書き方が分からない

これでしのいだけどもっとスマートな書き方ありそう…。

```ts
    interface IData {
      day: number;
      dark: boolean;
    }
    const row0: IData[] = [
      {day: 26, dark: true},
      {day: 27, dark: true},
      {day: 28, dark: true},
      {day: 29, dark: true},
      {day: 30, dark: true},
      {day: 31, dark: true},
      {day: 1, dark: false},
    ];
    const row1: IData[] = [
      {day: 2, dark: false},
      {day: 3, dark: false},
      {day: 4, dark: false},
      {day: 5, dark: false},
      {day: 6, dark: false},
      {day: 7, dark: false},
      {day: 8, dark: false},
    ];
    const row2: IData[] = [
      {day: 9, dark: false},
      {day: 10, dark: false},
      {day: 11, dark: false},
      {day: 12, dark: false},
      {day: 13, dark: false},
      {day: 14, dark: false},
      {day: 15, dark: false},
    ];
    const row3: IData[] = [
      {day: 16, dark: false},
      {day: 17, dark: false},
      {day: 18, dark: false},
      {day: 19, dark: false},
      {day: 20, dark: false},
      {day: 21, dark: false},
      {day: 22, dark: false},
    ];
    const row4: IData[] = [
      {day: 23, dark: false},
      {day: 24, dark: false},
      {day: 25, dark: false},
      {day: 26, dark: false},
      {day: 27, dark: false},
      {day: 28, dark: false},
      {day: 29, dark: false},
    ];
    const row5: IData[] = [
      {day: 30, dark: false},
      {day: 1, dark: true},
      {day: 2, dark: true},
      {day: 3, dark: true},
      {day: 4, dark: true},
      {day: 5, dark: true},
      {day: 6, dark: true},
    ];
    const cellDataArray = [row0, row1, row2, row3, row4, row5];
    const cells = <tbody>
      {cellDataArray.map((row, rowIndex) => {
        return (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              const classNames = cell.dark ? tableDataDarkClass : tableDataClass;
              return (<td key={rowIndex * 10 + colIndex} className={classNames}>{cell.day}</td>);
            })}
          </tr>
          );
        },
      )}
      </tbody>;
```

## 2018-08-08 vscode で行末空白の自動削除

lint 先生にめっちゃ怒られたので設定しました。

https://qiita.com/iwata-n@github/items/39dc0e4391277589878b

## 2018-08-08 vscode 上で tslint の結果がみたい

ないわけはないだろうと検索したらやっぱりありました。ありがたやー。

https://hi1280.hatenablog.com/entry/2017/07/23/235031

## 2018-08-08 enum キー文字列を parse して enum 値に変換

value の型が number な enum のキー文字列を渡して enum 値に変換するコード。なかなか検索してもでてこず時間かかりました。

```ts
// enum デシリアライズ
const enumPraseAccountKind = (targetKey: string): AccountKind => {
    for (const key in AccountKind) {
    if (key === targetKey) {
        return (+AccountKind[key]) as AccountKind;
    }
    }
    throw new Error(`Error: Not found key named '${targetKey}'.`);
};
```

## 2018-08-05 render 内で配列を指定する際は key が必要

SideBar の render 内で配列を出力したら下記のエラーが出た。

```Warning: Each child in an array or iterator should have a unique "key" prop.```

こちらのサイトに解説がありました。 https://qiita.com/koba04/items/a4d23245d246c53cd49d

配列の要素（今回だと SideBarBtn）に key={ユニークなキー} を追加することで対処。


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
