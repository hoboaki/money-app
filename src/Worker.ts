// Worker.ts
const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: 'foo' });

// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
  // tslint:disable-next-line:no-console
  console.log(event);
});
