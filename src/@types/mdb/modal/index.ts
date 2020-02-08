/// <reference types="jquery" />

// interface JQueryStatic {
//   contextMenu(options?: JQueryContextMenuOptions): JQuery;
//   contextMenu(type: string, selector?: any): JQuery;
// }

interface JQuery {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modal(options?: any): JQuery;
}
