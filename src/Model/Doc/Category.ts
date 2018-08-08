/// レコードのカテゴリ。
class Category {
  id: number = 0; // Id。
  name: string = ""; // カテゴリ名。
  parent: Category | null = null; // 親 Category の参照。null ならルート。
  childs: Category[] = []; // 子 Category の配列。
};

export default Category;
