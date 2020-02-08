import * as DataModelDocRootUtils from 'src/data-model/doc/RootUtils';
import IAutoSaveMsgData from 'src/IAutoSaveMsgData';
import * as DocStateMethods from 'src/state/doc/StateMethods';

// Worker 定義
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

// State を JSON 文字列に変換して返すスレッド処理。
ctx.onmessage = (event) => {
  // データ受信
  const data: IAutoSaveMsgData = event.data;

  // json 化
  const jsonText = DataModelDocRootUtils.toJson(DocStateMethods.toData(data.doc));

  // 結果を返却
  ctx.postMessage(jsonText);
};
