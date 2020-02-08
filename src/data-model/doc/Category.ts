/// レコードカテゴリデータ。
class Category {
  public id = 0; // Id。
  public name = ''; // カテゴリ名。
  public collapse = false; // true の場合ワークシート表示で閉じて表示する。
  public parent = 0; // 親カテゴリのId。0 ならルート。
}

export default Category;
