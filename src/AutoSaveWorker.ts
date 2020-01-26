import IAutoSaveMsgData from 'src/IAutoSaveMsgData';

// Worker 定義
const ctx: Worker = self as any;

// 自動保存処理要求があったときに呼ばれる。
ctx.onmessage = (event) => {
  // データ受信
  const data: IAutoSaveMsgData = event.data;
  // tslint:disable-next-line:no-console
  console.log(data);

  // 終了
  ctx.postMessage({});
};
