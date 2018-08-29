/// レコードカテゴリデータ。
class Category {
  public id: number = 0; // Id。
  public name: string = ''; // カテゴリ名。
  public parent: number = 0; // 親カテゴリのId。0 ならルート。
}

export default Category;
