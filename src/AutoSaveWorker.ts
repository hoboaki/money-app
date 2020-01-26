// Worker.ts
const ctx: Worker = self as any;

// 自動保存処理要求があったときに呼ばれる。
ctx.onmessage = (event) => {
  // tslint:disable-next-line:no-console
  console.log(event);

  // 終了
  ctx.postMessage({});
};
