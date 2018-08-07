/// レコードカテゴリデータ。
class Category {
  id: number = 0; ///< Id。
  name: string = ""; ///< カテゴリ名。
  parent: number = 0; ///< 親カテゴリのId。0 ならルート。
};

export default Category;
