/// レコードカテゴリデータ。
class Category {
  public id: number = 0; // Id。
  public name: string = ''; // カテゴリ名。
  public collapse: boolean = false; // true の場合ワークシート表示で閉じて表示する。
  public parent: number = 0; // 親カテゴリのId。0 ならルート。
}

export default Category;
