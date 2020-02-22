/** Palmカテゴリの情報。 */
class PalmCategoryInfo {
  public name = ''; // Palmカテゴリ名。
  public account = 0; // 対応する口座Id。0 なら口座ではないことを示す。
  public category = 0; // 対応するカテゴリId。0 ならカテゴリではないことを示す。
}

export default PalmCategoryInfo;
