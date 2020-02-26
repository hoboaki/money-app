import * as States from './States';

/** ウィンドウのタイトルとして表示する文字列を取得する。 */
export const windowTitleText = (state: States.IDocument): string => {
  return state.filePath.length === 0 ? 'スタートページ' : state.filePath.slice(state.filePath.lastIndexOf('/') + 1);
};
