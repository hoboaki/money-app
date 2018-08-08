/// レコードのカテゴリ。
class Category {
  public id: number = 0; // Id。
  public name: string = ''; // カテゴリ名。
  public parent: Category | null = null; // 親 Category の参照。null ならルート。
  public childs: Category[] = []; // 子 Category の配列。
}

export default Category;
