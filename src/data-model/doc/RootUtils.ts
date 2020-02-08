import Root from './Root';

/** 現在のファイルバージョン。 */
const versionCurrent = 1;

/** Json フォーマット。 */
interface IJsonRoot {
  /** ファイルバージョン。 */
  version: number;

  /** データのルート。 */
  data: Root;
}

/** Json テキストを Root に変換する。 */
export const fromJson = (jsonText: string): Root => {
  // Json パース
  const jsonRoot: IJsonRoot = JSON.parse(jsonText);

  // 現行バージョンのみ対応
  if (versionCurrent !== versionCurrent) {
    throw new Error('未サポートバージョンのデータです。');
  }

  // Root に変換して返す
  const result: Root = jsonRoot.data;
  return result;
};

/** Root を Json テキストに変換する */
export const toJson = (root: Root): string => {
  const jsonRoot: IJsonRoot = {
    version: versionCurrent,
    data: root,
  };
  return JSON.stringify(jsonRoot);
};
